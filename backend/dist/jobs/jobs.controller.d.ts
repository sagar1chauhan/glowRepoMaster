import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    scanRenewals(): Promise<{
        queued: number;
    }>;
    deactivateExpired(): Promise<{
        deactivated: number;
    }>;
}
