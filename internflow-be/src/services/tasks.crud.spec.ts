import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../repositories/tasks.repository', () => ({
  tasksRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('../repositories/intern.repository', () => ({
  internRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIdWithTasks: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn()
  }
}));

import { taskService } from './tasks.service';
import { tasksRepository } from '../repositories/tasks.repository';
import { internRepository } from '../repositories/intern.repository';

const FUTURE_DATE = '2099-01-01T00:00:00.000Z';

const baseTask = {
  id: 'task-1',
  title: 'Viết báo cáo',
  description: 'Mô tả task',
  intern_id: 'intern-1',
  status: 'IN_PROGRESS',
  rejected_count: 0,
  due_date: new Date(FUTURE_DATE),
  assigned_at: new Date(),
  submitted_at: null,
  closed_at: null,
  created_at: new Date(),
  updated_at: new Date(),
  interns: { id: 'intern-1', full_name: 'Nguyễn Văn A' }
};

describe('taskService - CRUD (Task)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC01 - createTask: không cho tạo task nếu thực tập sinh không tồn tại
  it('TC01 - createTask: throw lỗi khi intern không tồn tại', async () => {
    (internRepository.findById as any).mockResolvedValue(null);

    await expect(
      taskService.createTask({
        title: 'Task mới',
        intern_id: 'intern-not-exist',
        due_date: FUTURE_DATE
      })
    ).rejects.toThrow('Intern không tồn tại hoặc không ACTIVE');

    expect(tasksRepository.create).not.toHaveBeenCalled();
  });

  // TC02 - createTask: tạo task thành công khi dữ liệu hợp lệ
  it('TC02 - createTask: tạo task thành công khi dữ liệu hợp lệ', async () => {
    (internRepository.findById as any).mockResolvedValue({
      id: 'intern-1',
      full_name: 'Nguyễn Văn A',
      status: 'ACTIVE'
    });
    (tasksRepository.create as any).mockResolvedValue(baseTask);

    const result = await taskService.createTask({
      title: 'Viết báo cáo',
      description: 'Mô tả task',
      intern_id: 'intern-1',
      due_date: FUTURE_DATE
    });

    expect(tasksRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'task-1',
      title: 'Viết báo cáo',
      intern_id: 'intern-1',
      status: 'IN_PROGRESS'
    });
  });

  // TC03 - updateTask: không cho sửa task đã ở trạng thái DONE
  it('TC03 - updateTask: throw lỗi khi task đang ở trạng thái DONE', async () => {
    (tasksRepository.findById as any).mockResolvedValue({
      ...baseTask,
      status: 'DONE'
    });

    await expect(
      taskService.updateTask('task-1', { title: 'Tiêu đề mới' })
    ).rejects.toThrow('Không được sửa task DONE');

    expect(tasksRepository.update).not.toHaveBeenCalled();
  });

  // TC04 - updateTask: cập nhật task thành công khi task hợp lệ
  it('TC04 - updateTask: cập nhật task thành công khi task hợp lệ', async () => {
    (tasksRepository.findById as any).mockResolvedValue(baseTask);
    (tasksRepository.update as any).mockResolvedValue({
      ...baseTask,
      title: 'Tiêu đề đã cập nhật',
      description: 'Mô tả mới'
    });

    const result = await taskService.updateTask('task-1', {
      title: 'Tiêu đề đã cập nhật',
      description: 'Mô tả mới'
    });

    expect(tasksRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: 'task-1',
      title: 'Tiêu đề đã cập nhật',
      description: 'Mô tả mới'
    });
  });

  // TC05 - deleteTask: không cho xóa task không tồn tại
  it('TC05 - deleteTask: throw lỗi khi task không tồn tại', async () => {
    (tasksRepository.findById as any).mockResolvedValue(null);

    await expect(taskService.deleteTask('task-not-exist')).rejects.toThrow(
      'Không tìm thấy task'
    );

    expect(tasksRepository.delete).not.toHaveBeenCalled();
  });
});
