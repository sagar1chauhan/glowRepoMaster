import { Injectable } from '@nestjs/common';
import { DatabaseService, TenantContext } from '../database/database.service';

@Injectable()
export class SalesService {
  constructor(private readonly db: DatabaseService) {}

  async getDailyReport(context: TenantContext) {
    const query = `
      SELECT SUM(amount) as total_sales, payment_method 
      FROM sales 
      WHERE DATE(created_at) = CURRENT_DATE 
      GROUP BY payment_method
    `;
    const result = await this.db.queryWithContext(query, [], context);
    
    let cash = 0;
    let upi = 0;
    
    result.forEach(row => {
      if (row.payment_method === 'CASH') cash = parseFloat(row.total_sales);
      if (row.payment_method === 'UPI') upi = parseFloat(row.total_sales);
    });
    
    return { cash, upi, total: cash + upi };
  }
}
