import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const member = await this.membersService.findOne(req.user, id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  @Post()
  async create(@Request() req: any, @Body() data: any) {
    return this.membersService.create(req.user, data);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    const member = await this.membersService.update(req.user, id, data);
    if (!member) {
      throw new NotFoundException('Member not found or no fields to update');
    }
    return member;
  }
}
