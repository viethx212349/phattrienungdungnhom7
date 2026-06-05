import { taskService } from '../services/tasks.service';

// ============================================================
// Scheduler: Auto-close Overdue Tasks
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

  // Chạy ngay lần đầu
  void runAutoClose();

  // Đặt lịch lặp lại
  schedulerTimer = setInterval(() => {
    void runAutoClose();
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
