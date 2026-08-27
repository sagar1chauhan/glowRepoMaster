import { Injectable } from '@nestjs/common';
import { DatabaseService, TenantContext } from '../database/database.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly db: DatabaseService) {}

  async checkin(context: TenantContext, data: { member_id: string; gym_id?: string }) {
    const query = `
      INSERT INTO attendance (member_id, gym_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const params = [
      data.member_id,
      data.gym_id || context.gym_id
    ];
    const result = await this.db.queryWithContext(query, params, context);
    return result[0];
  }

  async getTodayCount(context: TenantContext) {
    const query = `
      SELECT COUNT(*) as count 
      FROM attendance 
      WHERE DATE(check_in_time) = CURRENT_DATE
    `;
    const result = await this.db.queryWithContext(query, [], context);
    return { count: parseInt(result[0].count, 10) };
  }
}
