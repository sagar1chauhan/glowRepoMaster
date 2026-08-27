import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';

@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('checkin')
  async checkin(@Request() req: any, @Body() data: { member_id: string; gym_id?: string; is_offline_sync?: boolean }) {
    // If it's an offline sync, we might handle timestamps differently, but for now we just insert
    return this.attendanceService.checkin(req.user, data);
  }

  @Get('today')
  async getTodayCount(@Request() req: any) {
    return this.attendanceService.getTodayCount(req.user);
  }
}
