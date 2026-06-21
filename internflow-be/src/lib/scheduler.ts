import { taskService } from '../services/tasks.service';
import { notificationService } from '../services/notification.service';
import { notificationRepository } from '../repositories/notification.repository';
import { tasksRepository } from '../repositories/tasks.repository';

// ============================================================
// Scheduler: Auto-close Overdue Tasks + Reminder Notifications
// ============================================================
// Chạy định kỳ mỗi INTERVAL_MS ms (mặc định: 60 phút).
// Dùng setInterval — không cần thêm thư viện ngoài.
// ============================================================

const INTERVAL_MS = 60 * 60 * 1000; // 60 phút

let schedulerTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Thực thi một lần: tìm và đóng các task quá hạn.
 */
const runAutoClose = async (): Promise<void> => {
  try {
    const result = await taskService.autoCloseOverdueTasks();

    if (result.closedCount > 0) {
      console.log(
        `[Scheduler] Auto-closed ${result.closedCount} overdue task(s) at ${result.ranAt.toISOString()}`
      );
      console.log(`[Scheduler] Task IDs: ${result.taskIds.join(', ')}`);
    } else {
      console.log(
        `[Scheduler] No overdue tasks found at ${result.ranAt.toISOString()}`
      );
    }
  } catch (err) {
    console.error('[Scheduler] Failed to auto-close overdue tasks:', err);
  }
};

/**
 * Gửi thông báo REMINDER cho các task sắp hết hạn trong 24 giờ tới.
 * Để tránh gửi trùng, chỉ tạo reminder nếu chưa có REMINDER nào
 * cho task đó trong 24 giờ qua.
 */
const runReminderCheck = async (): Promise<void> => {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Lấy tất cả task đang IN_PROGRESS
    const allTasks = await tasksRepository.findAll({ status: 'IN_PROGRESS' });

    // Lọc task có due_date trong 24 giờ tới
    const upcomingTasks = allTasks.filter(
      (task) =>
        task.due_date !== null &&
        task.due_date > now &&
        task.due_date <= in24Hours &&
        task.intern_id !== null
    );

    let reminderCount = 0;

    for (const task of upcomingTasks) {
      // Kiểm tra xem đã có reminder cho task này trong 24h qua chưa
      const existingReminder = await notificationRepository.findRecentReminder(
        task.id,
        past24Hours
      );

      if (!existingReminder && task.intern_id && task.due_date) {
        await notificationService.notifyReminder(
          task.intern_id,
          task.title,
          task.id,
          task.due_date
        );
        reminderCount++;
      }
    }

    if (reminderCount > 0) {
      console.log(
        `[Scheduler] Sent ${reminderCount} reminder notification(s) at ${now.toISOString()}`
      );
    } else {
      console.log(
        `[Scheduler] No reminder notifications needed at ${now.toISOString()}`
      );
    }
  } catch (err) {
    console.error('[Scheduler] Failed to send reminder notifications:', err);
  }
};

/**
 * Khởi động scheduler.
 * Gọi hàm này một lần khi server start.
 * - Chạy ngay lập tức lần đầu khi server start
 * - Sau đó lặp lại mỗi INTERVAL_MS
 */
export const startOverdueTaskScheduler = (): void => {
  if (schedulerTimer) return; // Tránh khởi động 2 lần

  console.log(
    `[Scheduler] Overdue task auto-close started (interval: ${INTERVAL_MS / 60000} min)`
  );
  console.log(
    `[Scheduler] Reminder notifications started (interval: ${INTERVAL_MS / 60000} min)`
  );

  // Chạy ngay lần đầu
  void runAutoClose();
  void runReminderCheck();

  // Đặt lịch lặp lại
  schedulerTimer = setInterval(() => {
    void runAutoClose();
    void runReminderCheck();
  }, INTERVAL_MS);
};

/**
 * Dừng scheduler (dùng khi graceful shutdown hoặc test).
 */
export const stopOverdueTaskScheduler = (): void => {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
    console.log('[Scheduler] Overdue task auto-close stopped.');
  }
};
