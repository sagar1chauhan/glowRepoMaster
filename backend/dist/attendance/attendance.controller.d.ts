import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkin(req: any, data: {
        member_id: string;
        gym_id?: string;
        is_offline_sync?: boolean;
    }): Promise<any>;
    getTodayCount(req: any): Promise<{
        count: number;
    }>;
}
