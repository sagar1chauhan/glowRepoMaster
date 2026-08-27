import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * POST /jobs/scan-renewals
   * Manually trigger the nightly renewal scan (also triggered by CRON).
   * Protected: Master Admin only.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('scan-renewals')
  async scanRenewals() {
    return this.jobsService.scanAndQueueRenewalReminders();
  }

  /**
   * POST /jobs/deactivate-expired
   * Manually trigger deactivation of expired memberships.
   * Protected: Master Admin only.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('deactivate-expired')
  async deactivateExpired() {
    return this.jobsService.deactivateExpiredMemberships();
  }
}
