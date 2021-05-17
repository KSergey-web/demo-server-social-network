import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { consoleOut } from 'src/debug';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
    
  }

  @ApiBearerAuth()
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getTask( @User() { _id }: UserDocument) {
    return await this.notificationService.getNotification( _id);
  }

  @ApiBearerAuth()
  @Get('all/markreaded')
  @UseGuards(JwtAuthGuard)
  async markAllAsReaded( @User() { _id }: UserDocument) {
    return await this.notificationService.markAllAsReaded( _id);
  }

  @ApiBearerAuth()
  @Get('quantity/notReaded')
  @UseGuards(JwtAuthGuard)
  async getNotReaded( @User() { _id }: UserDocument) {
    return {quantity: await this.notificationService.getNotReaded( _id)};
  }
}
