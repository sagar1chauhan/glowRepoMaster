import { DatabaseService, TenantContext } from '../database/database.service';
export declare class SalesService {
    private readonly db;
    constructor(db: DatabaseService);
    getDailyReport(context: TenantContext): Promise<{
        cash: number;
        upi: number;
        total: number;
    }>;
}
