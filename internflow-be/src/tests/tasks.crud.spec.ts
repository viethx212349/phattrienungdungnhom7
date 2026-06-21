import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../services/tasks.service';
import { tasksRepository } from '../repositories/tasks.repository';
import { internRepository } from '../repositories/intern.repository';

// ====== MOCK REPOSITORIES ======
vi.mock('../repositories/tasks.repository', () => ({
  tasksRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../repositories/intern.repository', () => ({
  internRepository: {
    findById: vi.fn(),
  },
}));

describe('Task CRUD cơ bản (TC01 – TC05)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  // TC01 - createTask: Lỗi khi thực tập sinh không tồn tại
  // ──────────────────────────────────────────────────────────
  it('TC01 - createTask: Không cho tạo task nếu thực tập sinh không tồn tại', async () => {
    vi.mocked(internRepository.findById).mockResolvedValue(null);

    await expect(
      taskService.createTask({
        title: 'Task mới',
        intern_id: 'invalid-intern-id',
        due_date: '2027-12-31',
      })
    ).rejects.toThrow('Intern không tồn tại hoặc không ACTIVE');

    expect(internRepository.findById).toHaveBeenCalledWith('invalid-intern-id');
  });

  // ──────────────────────────────────────────────────────────
  // TC02 - createTask: Tạo task thành công
  // ──────────────────────────────────────────────────────────
  it('TC02 - createTask: Tạo task thành công khi dữ liệu hợp lệ', async () => {
    const mockIntern = { status: 'ACTIVE' } as any;
    const mockCreatedTask = {
      id: 'new-task-id',
      title: 'Task mới',
      status: 'IN_PROGRESS',
      intern_id: 'intern-uuid-1',
    } as any;

    vi.mocked(internRepository.findById).mockResolvedValue(mockIntern);
    vi.mocked(tasksRepository.create).mockResolvedValue(mockCreatedTask);

    const result = await taskService.createTask({
      title: 'Task mới',
      intern_id: 'intern-uuid-1',
      due_date: '2027-12-31T00:00:00Z',
    });

    expect(internRepository.findById).toHaveBeenCalledWith('intern-uuid-1');
    expect(tasksRepository.create).toHaveBeenCalledOnce();
    expect(result.id).toBe('new-task-id');
    expect(result.title).toBe('Task mới');
    expect(result.display_status).toBe('IN_PROGRESS');
  });

  // ──────────────────────────────────────────────────────────
  // TC03 - updateTask: Lỗi khi sửa task DONE
  // ──────────────────────────────────────────────────────────
  it('TC03 - updateTask: Không cho sửa task đã ở trạng thái DONE', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue({ status: 'DONE' } as any);

    await expect(
      taskService.updateTask('task-done-id', { title: 'Tên mới' })
    ).rejects.toThrow('Không được sửa task DONE');

    expect(tasksRepository.findById).toHaveBeenCalledWith('task-done-id');
  });

  // ──────────────────────────────────────────────────────────
  // TC04 - updateTask: Cập nhật thành công
  // ──────────────────────────────────────────────────────────
  it('TC04 - updateTask: Cập nhật task thành công khi task hợp lệ', async () => {
    const mockTaskTodo = { id: 'task-todo-id', status: 'TODO', rejected_count: 0 } as any;
    const mockUpdatedTask = {
      id: 'task-todo-id',
      title: 'Tên mới update',
      status: 'TODO',
      rejected_count: 0,
      submitted_at: null,
    } as any;

    vi.mocked(tasksRepository.findById).mockResolvedValue(mockTaskTodo);
    vi.mocked(tasksRepository.update).mockResolvedValue(mockUpdatedTask);

    const result = await taskService.updateTask('task-todo-id', { title: 'Tên mới update' });

    expect(tasksRepository.update).toHaveBeenCalledWith('task-todo-id', expect.objectContaining({
      title: 'Tên mới update',
    }));
    expect(result.title).toBe('Tên mới update');
  });

  // ──────────────────────────────────────────────────────────
  // TC05 - deleteTask: Lỗi khi xóa task không tồn tại
  // ──────────────────────────────────────────────────────────
  it('TC05 - deleteTask: Không cho xóa task không tồn tại', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue(null);

    await expect(taskService.deleteTask('non-existent-task-id')).rejects.toThrow('Không tìm thấy task');

    expect(tasksRepository.findById).toHaveBeenCalledWith('non-existent-task-id');
  });
});
