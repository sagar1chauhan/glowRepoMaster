"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const config_1 = require("@nestjs/config");
const database_service_1 = require("../database/database.service");
const notifications_service_1 = require("../notifications/notifications.service");
let JobsService = JobsService_1 = class JobsService {
    configService;
    databaseService;
    notificationsService;
    logger = new common_1.Logger(JobsService_1.name);
    renewalQueue = null;
    renewalWorker = null;
    constructor(configService, databaseService, notificationsService) {
        this.configService = configService;
        this.databaseService = databaseService;
        this.notificationsService = notificationsService;
    }
    async onModuleInit() {
        const redisHost = this.configService.get('REDIS_HOST', '');
        const redisPort = parseInt(this.configService.get('REDIS_PORT', '6379'), 10);
        if (!redisHost) {
            this.logger.warn('REDIS_HOST not set — BullMQ jobs will run in MOCK mode (no background workers)');
            return;
        }
        const connection = { host: redisHost, port: redisPort };
        this.renewalQueue = new bullmq_1.Queue('renewal-reminders', { connection });
        this.logger.log('BullMQ renewal-reminders queue initialized');
        this.renewalWorker = new bullmq_1.Worker('renewal-reminders', async (job) => {
            await this.processRenewalReminder(job);
        }, { connection });
        this.renewalWorker.on('completed', (job) => {
            this.logger.log(`Job ${job.id} completed`);
        });
        this.renewalWorker.on('failed', (job, err) => {
            this.logger.error(`Job ${job?.id} failed: ${err.message}`);
        });
    }
    async scanAndQueueRenewalReminders() {
        this.logger.log('Scanning for memberships expiring in 7 days...');
        const expiringMembers = await this.databaseService.query(`SELECT m.id, m.name, m.phone, m.membership_expiry, g.name as gym_name, m.gym_id
       FROM members m
       JOIN gyms g ON g.id = m.gym_id
       WHERE m.status = 'ACTIVE'
         AND m.membership_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
         AND m.renewal_reminder_sent = false`);
        if (!this.renewalQueue) {
            this.logger.log(`[MOCK] Would queue ${expiringMembers.length} renewal reminders`);
            for (const member of expiringMembers) {
                this.logger.log(`[MOCK] Reminder: ${member.name} (${member.phone}) → expires ${member.membership_expiry}`);
                await this.notificationsService.sendRenewalReminder(member.phone, member.name, member.membership_expiry, member.gym_name);
            }
            return { queued: expiringMembers.length };
        }
        for (const member of expiringMembers) {
            await this.renewalQueue.add('send-renewal', {
                memberId: member.id,
                phone: member.phone,
                memberName: member.name,
                expiryDate: member.membership_expiry,
                gymName: member.gym_name,
                gymId: member.gym_id,
            });
        }
        this.logger.log(`Queued ${expiringMembers.length} renewal reminder jobs`);
        return { queued: expiringMembers.length };
    }
    async processRenewalReminder(job) {
        const { phone, memberName, expiryDate, gymName, memberId } = job.data;
        this.logger.log(`Processing renewal reminder for ${memberName} (${phone})`);
        await this.notificationsService.sendRenewalReminder(phone, memberName, expiryDate, gymName);
        await this.databaseService.query(`UPDATE members SET renewal_reminder_sent = true WHERE id = $1`, [memberId]);
    }
    async deactivateExpiredMemberships() {
        this.logger.log('Scanning for expired memberships...');
        const result = await this.databaseService.query(`UPDATE members 
       SET status = 'EXPIRED' 
       WHERE status = 'ACTIVE' 
         AND membership_expiry < CURRENT_DATE
       RETURNING id, name, phone`);
        this.logger.log(`Deactivated ${result.length} expired memberships`);
        return { deactivated: result.length };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        database_service_1.DatabaseService,
        notifications_service_1.NotificationsService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map