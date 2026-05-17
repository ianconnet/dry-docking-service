import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { Authorize } from 'src/guards/authorize.decorator';
import { GroupPolicy } from 'src/proto-interfaces/authorize';
import { UserId } from 'src/decorators/userId.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthorizeGuard)
  @Authorize(GroupPolicy.REQUESTS)
  @Get('')
  async getUserNotifications(@UserId() userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @UseGuards(AuthorizeGuard)
  @Authorize(GroupPolicy.REQUESTS)
  @Get('unread-count')
  async getUnreadNotificationsCount(@UserId() userId: string) {
    return this.notificationService.getUnreadNotificationsCount(userId);
  }

  @UseGuards(AuthorizeGuard)
  @Authorize(GroupPolicy.REQUESTS)
  @Put('mark-read')
  async markNotificationsAsRead(
    @Body() { notificationIds }: { notificationIds: string[] },
  ) {
    return this.notificationService.markAsRead(notificationIds);
  }
}
