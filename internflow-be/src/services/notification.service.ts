// ============================================================
// Observer Pattern — Notification Service
// ============================================================
// Đây là Observer trong Observer Pattern.
// Subject: Task (khi trạng thái thay đổi)
// Observer: NotificationService (lắng nghe và tạo thông báo)
//
// Khi task thay đổi trạng thái → gọi notify*() → tạo record
// trong bảng notifications.
// ============================================================

import { notificationRepository } from '../repositories/notification.repository';

export const notificationService = {
  /**
   * Thông báo khi intern được giao nhiệm vụ mới.
   * Được gọi từ taskService.createTask() và taskService.assignTask().
   */
  notifyNewTask: async (internId: string, taskTitle: string, taskId: string) => {
    return await notificationRepository.create({
      intern_id: internId,
      task_id: taskId,
      title: 'Nhiệm vụ mới',
      message: `Bạn được giao nhiệm vụ: ${taskTitle}`,
      type: 'NEW_TASK'
    });
  },

  /**
   * Thông báo khi mentor từ chối task.
   * Được gọi từ taskService.rejectTask().
   */
  notifyTaskRejected: async (internId: string, taskTitle: string, taskId: string, feedback: string) => {
    return await notificationRepository.create({
      intern_id: internId,
      task_id: taskId,
      title: 'Nhiệm vụ bị từ chối',
      message: `Nhiệm vụ "${taskTitle}" bị từ chối. Phản hồi: ${feedback}`,
      type: 'REJECTED'
    });
  },

  /**
   * Thông báo nhắc nhở khi task sắp hết hạn.
   * Được gọi từ scheduler khi task còn < 24h.
   */
  notifyReminder: async (internId: string, taskTitle: string, taskId: string, dueDate: Date) => {
    const formattedDate = dueDate.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return await notificationRepository.create({
      intern_id: internId,
      task_id: taskId,
      title: 'Sắp hết hạn',
      message: `Nhiệm vụ "${taskTitle}" sắp hết hạn vào ${formattedDate}`,
      type: 'REMINDER'
    });
  },

  /**
   * Lấy danh sách thông báo (tuỳ chọn lọc theo intern).
   */
  getNotifications: async (internId?: string) => {
    if (internId) {
      return await notificationRepository.findByInternId(internId);
    }
    return await notificationRepository.findAll();
  },

  /**
   * Đánh dấu một thông báo đã đọc.
   */
  markAsRead: async (id: string) => {
    return await notificationRepository.markAsRead(id);
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc (tuỳ chọn theo intern).
   */
  markAllAsRead: async (internId?: string) => {
    if (internId) {
      return await notificationRepository.markAllAsReadByInternId(internId);
    }
    // Nếu không truyền internId → đánh dấu tất cả
    return await notificationRepository.markAllAsReadByInternId('');
  },

  /**
   * Đếm số thông báo chưa đọc (tuỳ chọn theo intern).
   */
  getUnreadCount: async (internId?: string) => {
    return await notificationRepository.countUnread(internId);
  }
};
