import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);
  private renewalQueue: Queue | null = null;
  private renewalWorker: Worker | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST', '');
    const redisPort = parseInt(this.configService.get<string>('REDIS_PORT', '6379'), 10);

    if (!redisHost) {
      this.logger.warn('REDIS_HOST not set — BullMQ jobs will run in MOCK mode (no background workers)');
      return;
    }

    const connection = { host: redisHost, port: redisPort };

    // Create the renewal reminder queue
    this.renewalQueue = new Queue('renewal-reminders', { connection });
    this.logger.log('BullMQ renewal-reminders queue initialized');

    // Create the worker that processes renewal reminder jobs
    this.renewalWorker = new Worker(
      'renewal-reminders',
      async (job: Job) => {
        await this.processRenewalReminder(job);
      },
      { connection },
    );

    this.renewalWorker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed`);
    });

    this.renewalWorker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err.message}`);
    });
  }

  /**
   * Scans for memberships expiring in the next 7 days and queues WhatsApp reminders.
   * Designed to be called nightly via a CRON trigger.
   */
  async scanAndQueueRenewalReminders(): Promise<{ queued: number }> {
    this.logger.log('Scanning for memberships expiring in 7 days...');

    // Query members whose membership expires in the next 7 days
    const expiringMembers = await this.databaseService.query(
      `SELECT m.id, m.name, m.phone, m.membership_expiry, g.name as gym_name, m.gym_id
       FROM members m
       JOIN gyms g ON g.id = m.gym_id
       WHERE m.status = 'ACTIVE'
         AND m.membership_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
         AND m.renewal_reminder_sent = false`,
    );

    if (!this.renewalQueue) {
      // Mock mode: just log what would be queued
      this.logger.log(`[MOCK] Would queue ${expiringMembers.length} renewal reminders`);
      for (const member of expiringMembers) {
        this.logger.log(`[MOCK] Reminder: ${member.name} (${member.phone}) → expires ${member.membership_expiry}`);
        await this.notificationsService.sendRenewalReminder(
          member.phone,
          member.name,
          member.membership_expiry,
          member.gym_name,
        );
      }
      return { queued: expiringMembers.length };
    }

    // Real mode: add jobs to the BullMQ queue
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

  /**
   * Processes a single renewal reminder job from the queue.
   */
  private async processRenewalReminder(job: Job) {
    const { phone, memberName, expiryDate, gymName, memberId } = job.data;

    this.logger.log(`Processing renewal reminder for ${memberName} (${phone})`);

    await this.notificationsService.sendRenewalReminder(phone, memberName, expiryDate, gymName);

    // Mark the member as reminder-sent so we don't send duplicates
    await this.databaseService.query(
      `UPDATE members SET renewal_reminder_sent = true WHERE id = $1`,
      [memberId],
    );
  }

  /**
   * Deactivates memberships that have expired (nightly job).
   */
  async deactivateExpiredMemberships(): Promise<{ deactivated: number }> {
    this.logger.log('Scanning for expired memberships...');

    const result = await this.databaseService.query(
      `UPDATE members 
       SET status = 'EXPIRED' 
       WHERE status = 'ACTIVE' 
         AND membership_expiry < CURRENT_DATE
       RETURNING id, name, phone`,
    );

    this.logger.log(`Deactivated ${result.length} expired memberships`);
    return { deactivated: result.length };
  }
}
