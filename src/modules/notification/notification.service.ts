import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateNotificationDto } from './dtos/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          message: dto.message,
          link: dto.link,
        },
      });

      return {
        success: true,
        message: 'Notification created successfully',
        data: notification,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error creating notification',
      };
    }
  }

  async markAsRead(notificationIds: string[]) {
    try {
      const updatedNotifications = await this.prisma.notification.updateMany({
        where: { id: { in: notificationIds } },
        data: { read: true },
      });

      return {
        success: true,
        message: 'Notifications marked as read',
        data: updatedNotifications,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error marking notifications as read',
      };
    }
  }

  async getUserNotifications(userId: string) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error retrieving notifications',
      };
    }
  }

  async getUnreadNotificationsCount(userId: string) {
    try {
      const count = await this.prisma.notification.count({
        where: { userId, read: false },
      });

      return {
        success: true,
        message: 'Unread notifications count retrieved successfully',
        data: count,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error retrieving unread notifications count',
      };
    }
  }
}
