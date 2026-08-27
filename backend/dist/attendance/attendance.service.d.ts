import { DatabaseService, TenantContext } from '../database/database.service';
export declare class AttendanceService {
    private readonly db;
    constructor(db: DatabaseService);
    checkin(context: TenantContext, data: {
        member_id: string;
        gym_id?: string;
    }): Promise<any>;
    getTodayCount(context: TenantContext): Promise<{
        count: number;
    }>;
}
