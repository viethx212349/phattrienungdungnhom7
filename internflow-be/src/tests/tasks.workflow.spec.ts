import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../services/tasks.service';
import { tasksRepository } from '../repositories/tasks.repository';
import { internRepository } from '../repositories/intern.repository';

// ====== MOCK REPOSITORIES ======
vi.mock('../repositories/tasks.repository', () => ({
  tasksRepository: {
    findById: vi.fn(),
    update: vi.fn(),
    findAll: vi.fn(),
  },
}));

vi.mock('../repositories/intern.repository', () => ({
  internRepository: {
    findById: vi.fn(),
  },
}));

describe('Task Workflow (TC06 – TC10)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  // TC06 - approveTask: Lỗi khi task chưa IN_REVIEW
  // ──────────────────────────────────────────────────────────
  it('TC06 - approveTask: Không cho duyệt task nếu task chưa ở trạng thái IN_REVIEW', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue({ status: 'IN_PROGRESS' } as any);

    await expect(taskService.approveTask('task-id', {})).rejects.toThrow('Chỉ task IN_REVIEW mới có thể approve');

    expect(tasksRepository.findById).toHaveBeenCalledWith('task-id');
  });

  // ──────────────────────────────────────────────────────────
  // TC07 - approveTask: Duyệt task thành công
  // ──────────────────────────────────────────────────────────
  it('TC07 - approveTask: Duyệt task thành công khi task đang ở trạng thái IN_REVIEW', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue({ status: 'IN_REVIEW' } as any);
    
    const mockUpdatedTask = { status: 'DONE', submitted_at: new Date() } as any;
    vi.mocked(tasksRepository.update).mockResolvedValue(mockUpdatedTask);

    const result = await taskService.approveTask('task-id', { mentor_feedback: 'Tốt' });

    expect(tasksRepository.update).toHaveBeenCalledWith('task-id', expect.objectContaining({
      status: 'DONE',
      mentor_feedback: 'Tốt',
    }));
    expect(result.status).toBe('DONE');
  });

  // ──────────────────────────────────────────────────────────
  // TC08 - rejectTask: Từ chối task thành công
  // ──────────────────────────────────────────────────────────
  it('TC08 - rejectTask: Từ chối task thành công khi task đang ở trạng thái IN_REVIEW', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue({ status: 'IN_REVIEW', rejected_count: 0 } as any);
    
    const mockUpdatedTask = { status: 'IN_PROGRESS', rejected_count: 1 } as any;
    vi.mocked(tasksRepository.update).mockResolvedValue(mockUpdatedTask);

    const result = await taskService.rejectTask('task-id', { mentor_feedback: 'Cần sửa lại' });

    expect(tasksRepository.update).toHaveBeenCalledWith('task-id', expect.objectContaining({
      status: 'IN_PROGRESS',
      rejected_count: 1,
      mentor_feedback: 'Cần sửa lại',
    }));
    expect(result.status).toBe('IN_PROGRESS');
    expect(result.rejected_count).toBe(1);
  });

  // ──────────────────────────────────────────────────────────
  // TC09 - assignTask: Gán task thành công
  // ──────────────────────────────────────────────────────────
  it('TC09 - assignTask: Gán task cho thực tập sinh thành công khi task và thực tập sinh đều tồn tại', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue({ status: 'TODO' } as any);
    vi.mocked(internRepository.findById).mockResolvedValue({ status: 'ACTIVE' } as any);
    
    const mockUpdatedTask = { status: 'IN_PROGRESS', intern_id: 'intern-1', due_date: new Date('2027-12-31') } as any;
    vi.mocked(tasksRepository.update).mockResolvedValue(mockUpdatedTask);

    const result = await taskService.assignTask('task-id', { intern_id: 'intern-1', due_date: '2027-12-31T00:00:00Z' });

    expect(tasksRepository.update).toHaveBeenCalledWith('task-id', expect.objectContaining({
      intern_id: 'intern-1',
      status: 'IN_PROGRESS',
    }));
    expect(result.status).toBe('IN_PROGRESS');
  });

  // ──────────────────────────────────────────────────────────
  // TC10 - autoCloseOverdueTasks: Tự động đóng task quá hạn
  // ──────────────────────────────────────────────────────────
  it('TC10 - autoCloseOverdueTasks: Tự động xử lý các task quá hạn', async () => {
    const pastDate = new Date(Date.now() - 100000);
    const mockTasks = [
      { id: 'task-1', status: 'IN_PROGRESS', due_date: pastDate },
      { id: 'task-2', status: 'IN_PROGRESS', due_date: pastDate },
      { id: 'task-3', status: 'IN_PROGRESS', due_date: new Date(Date.now() + 100000) }, // Không quá hạn
    ] as any[];

    vi.mocked(tasksRepository.findAll).mockResolvedValue(mockTasks);
    vi.mocked(tasksRepository.update).mockResolvedValue({} as any);

    const result = await taskService.autoCloseOverdueTasks();

    // Sẽ cập nhật 2 task quá hạn
    expect(tasksRepository.update).toHaveBeenCalledTimes(2);
    expect(tasksRepository.update).toHaveBeenCalledWith('task-1', expect.objectContaining({ status: 'DONE' }));
    expect(tasksRepository.update).toHaveBeenCalledWith('task-2', expect.objectContaining({ status: 'DONE' }));
    expect(result.closedCount).toBe(2);
  });
});
