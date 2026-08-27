import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class JobsService implements OnModuleInit {
    private readonly configService;
    private readonly databaseService;
    private readonly notificationsService;
    private readonly logger;
    private renewalQueue;
    private renewalWorker;
    constructor(configService: ConfigService, databaseService: DatabaseService, notificationsService: NotificationsService);
    onModuleInit(): Promise<void>;
    scanAndQueueRenewalReminders(): Promise<{
        queued: number;
    }>;
    private processRenewalReminder;
    deactivateExpiredMemberships(): Promise<{
        deactivated: number;
    }>;
}
