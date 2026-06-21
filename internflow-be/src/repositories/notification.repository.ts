import { prisma } from '../lib/prisma';
import { notification_type } from '@prisma/client';

type NotificationType = notification_type;

export const notificationRepository = {
  // Lấy tất cả thông báo của một intern, mới nhất trước
  findByInternId: async (internId: string) => {
    return await prisma.notifications.findMany({
      where: { intern_id: internId },
      orderBy: { created_at: 'desc' },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    });
  },

  // Lấy tất cả thông báo, mới nhất trước
  findAll: async () => {
    return await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        interns: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    });
  },

  // Tạo thông báo mới
  create: async (data: {
    intern_id: string;
    task_id?: string | null;
    title: string;
    message: string;
    type: NotificationType;
  }) => {
    return await prisma.notifications.create({
      data: {
        intern_id: data.intern_id,
        task_id: data.task_id ?? null,
        title: data.title,
        message: data.message,
        type: data.type
      }
    });
  },

  // Đánh dấu đã đọc
  markAsRead: async (id: string) => {
    return await prisma.notifications.update({
      where: { id },
      data: { is_read: true }
    });
  },

  // Đánh dấu tất cả thông báo của intern là đã đọc
  markAllAsReadByInternId: async (internId: string) => {
    return await prisma.notifications.updateMany({
      where: { intern_id: internId, is_read: false },
      data: { is_read: true }
    });
  },

  // Đếm số thông báo chưa đọc (tuỳ chọn lọc theo intern)
  countUnread: async (internId?: string) => {
    const where: any = { is_read: false };
    if (internId) {
      where.intern_id = internId;
    }
    return await prisma.notifications.count({ where });
  },

  // Tìm thông báo REMINDER cho task trong khoảng thời gian
  findRecentReminder: async (taskId: string, since: Date) => {
    return await prisma.notifications.findFirst({
      where: {
        task_id: taskId,
        type: 'REMINDER',
        created_at: { gte: since }
      }
    });
  }
};
