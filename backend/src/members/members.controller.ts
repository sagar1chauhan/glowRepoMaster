import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembersService } from './members.service';

@UseGuards(AuthGuard('jwt'))
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.membersService.findAll(req.user);
  }

  @Post()
  async create(@Request() req: any, @Body() data: any) {
    return this.membersService.create(req.user, data);
  }
}
