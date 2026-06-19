/**
 *  FILE: queries.spec.ts
 *  MỤC TIÊU: Unit Test cho phần Queries / Lấy dữ liệu (TC11 – TC15)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../services/tasks.service';
import { internService } from '../services/intern.service';
import { tasksRepository } from '../repositories/tasks.repository';
import { internRepository } from '../repositories/intern.repository';

// ====== MOCK REPOSITORIES ======
vi.mock('../repositories/tasks.repository', () => ({
  tasksRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../repositories/intern.repository', () => ({
  internRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIdWithTasks: vi.fn(),
    findByEmail: vi.fn(),
  },
}));

// ====== DỮ LIỆU GIẢ DÙNG CHUNG ======
const now = new Date('2025-06-15T10:00:00Z');

const mockTasksList = [
  {
    id: 'task-uuid-1',
    title: 'Thiết kế giao diện Login',
    description: 'Tạo UI login cho hệ thống',
    intern_id: 'intern-uuid-1',
    status: 'TODO' as const,
    rejected_count: 0,
    due_date: new Date('2025-07-01T00:00:00Z'),
    assigned_at: null,
    submitted_at: null,
    closed_at: null,
    created_at: now,
    updated_at: now,
    interns: { id: 'intern-uuid-1', full_name: 'Nguyễn Văn A' },
  },
  {
    id: 'task-uuid-2',
    title: 'Viết API CRUD',
    description: 'Xây dựng REST API cho module tasks',
    intern_id: 'intern-uuid-2',
    status: 'IN_PROGRESS' as const,
    rejected_count: 0,
    due_date: new Date('2025-07-15T00:00:00Z'),
    assigned_at: new Date('2025-06-10T00:00:00Z'),
    submitted_at: null,
    closed_at: null,
    created_at: now,
    updated_at: now,
    interns: { id: 'intern-uuid-2', full_name: 'Trần Thị B' },
  },
];

const mockKanbanTasks = [
  {
    id: 'kanban-1',
    title: 'Task chưa giao',
    description: null,
    intern_id: null,
    status: 'TODO' as const,
    rejected_count: 0,
    due_date: null,
    assigned_at: null,
    submitted_at: null,
    closed_at: null,
    created_at: now,
    updated_at: now,
    interns: null,
  },
  {
    id: 'kanban-2',
    title: 'Task đang làm',
    description: 'Đang code feature X',
    intern_id: 'intern-uuid-1',
    status: 'IN_PROGRESS' as const,
    rejected_count: 0,
    due_date: new Date('2025-07-10T00:00:00Z'),
    assigned_at: new Date('2025-06-01T00:00:00Z'),
    submitted_at: null,
    closed_at: null,
    created_at: now,
    updated_at: now,
    interns: { id: 'intern-uuid-1', full_name: 'Nguyễn Văn A' },
  },
  {
    id: 'kanban-3',
    title: 'Task chờ review',
    description: 'Đã nộp bài',
    intern_id: 'intern-uuid-2',
    status: 'IN_REVIEW' as const,
    rejected_count: 0,
    due_date: new Date('2025-07-05T00:00:00Z'),
    assigned_at: new Date('2025-06-01T00:00:00Z'),
    submitted_at: new Date('2025-06-14T00:00:00Z'),
    closed_at: null,
    created_at: now,
    updated_at: now,
    interns: { id: 'intern-uuid-2', full_name: 'Trần Thị B' },
  },
  {
    id: 'kanban-4',
    title: 'Task hoàn thành',
    description: 'Đã xong',
    intern_id: 'intern-uuid-1',
    status: 'DONE' as const,
    rejected_count: 0,
    due_date: new Date('2025-06-30T00:00:00Z'),
    assigned_at: new Date('2025-06-01T00:00:00Z'),
    submitted_at: new Date('2025-06-12T00:00:00Z'),
    closed_at: new Date('2025-06-13T00:00:00Z'),
    created_at: now,
    updated_at: now,
    interns: { id: 'intern-uuid-1', full_name: 'Nguyễn Văn A' },
  },
];

const mockTaskDetail = {
  id: 'task-uuid-1',
  title: 'Thiết kế giao diện Login',
  description: 'Tạo UI login cho hệ thống',
  intern_id: 'intern-uuid-1',
  status: 'IN_PROGRESS' as const,
  rejected_count: 0,
  due_date: new Date('2025-07-01T00:00:00Z'),
  assigned_at: new Date('2025-06-10T00:00:00Z'),
  submitted_at: null,
  closed_at: null,
  created_at: now,
  updated_at: now,
  submission_link: 'https://github.com/intern/pr/1',
  submission_summary: 'Đã hoàn thành giao diện login',
  mentor_feedback: 'Tốt, cần cải thiện responsive',
  interns: {
    id: 'intern-uuid-1',
    full_name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    position: 'Frontend Developer',
    phone: '0901234567',
    school: 'ĐH Bách Khoa',
    status: 'ACTIVE',
  },
  task_attachments: [
    {
      id: 'attach-1',
      file_name: 'design_spec.pdf',
      file_url: '/uploads/design_spec.pdf',
      file_size: BigInt(204800),
      type: 'MENTOR_DOC',
      created_at: now,
    },
  ],
};

const mockInternsList = [
  {
    id: 'intern-uuid-1',
    full_name: 'Nguyễn Văn A',
    intern_code: 'INT-000001',
    position: 'Frontend Developer',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    school: 'ĐH Bách Khoa',
    status: 'ACTIVE',
    final_feedback: null,
  },
  {
    id: 'intern-uuid-2',
    full_name: 'Trần Thị B',
    intern_code: 'INT-000002',
    position: 'Backend Developer',
    email: 'tranthib@email.com',
    phone: '0907654321',
    school: 'ĐH Công Nghệ',
    status: 'ACTIVE',
    final_feedback: null,
  },
];

// ============================================================
//  DESCRIBE: QUERIES / LẤY DỮ LIỆU
// ============================================================

describe('Queries / Lấy dữ liệu (TC11 – TC15)', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mock sau mỗi test
  });

  // ──────────────────────────────────────────────────────────
  // TC11 - getAllTasks
  // ──────────────────────────────────────────────────────────
  it('TC11 - getAllTasks: Lấy danh sách task thành công', async () => {
    vi.mocked(tasksRepository.findAll).mockResolvedValue(mockTasksList);

    const result = await taskService.getAllTasks({});

    expect(tasksRepository.findAll).toHaveBeenCalledOnce();
    expect(result).toHaveLength(2);

    // Kiểm tra task TODO map sang UNASSIGNED
    expect(result[0]).toMatchObject({
      id: 'task-uuid-1',
      title: 'Thiết kế giao diện Login',
      status: 'TODO',
      display_status: 'UNASSIGNED',
      intern_name: 'Nguyễn Văn A',
    });

    // Kiểm tra task IN_PROGRESS
    expect(result[1]).toMatchObject({
      id: 'task-uuid-2',
      title: 'Viết API CRUD',
      status: 'IN_PROGRESS',
      display_status: 'IN_PROGRESS',
      intern_name: 'Trần Thị B',
    });
  });

  // ──────────────────────────────────────────────────────────
  // TC12 - getTasksKanban
  // ──────────────────────────────────────────────────────────
  it('TC12 - getTasksKanban: Nhóm task theo trạng thái Kanban', async () => {
    vi.mocked(tasksRepository.findAll).mockResolvedValue(mockKanbanTasks);

    const result = await taskService.getTasksKanban();

    expect(tasksRepository.findAll).toHaveBeenCalledOnce();
    
    // Kiểm tra nhóm đủ 4 trạng thái
    expect(result).toHaveProperty('TODO');
    expect(result).toHaveProperty('IN_PROGRESS');
    expect(result).toHaveProperty('IN_REVIEW');
    expect(result).toHaveProperty('DONE');

    // Kiểm tra từng nhóm task map đúng display_status
    expect(result.TODO[0]).toMatchObject({ display_status: 'UNASSIGNED' });
    expect(result.IN_PROGRESS[0]).toMatchObject({ display_status: 'IN_PROGRESS' });
    expect(result.IN_REVIEW[0]).toMatchObject({ display_status: 'WAITING_REVIEW' });
    expect(result.DONE[0]).toMatchObject({ display_status: 'COMPLETED' });
  });

  // ──────────────────────────────────────────────────────────
  // TC13 - getTaskById
  // ──────────────────────────────────────────────────────────
  it('TC13 - getTaskById: Lấy chi tiết task thành công', async () => {
    vi.mocked(tasksRepository.findById).mockResolvedValue(mockTaskDetail as any);

    const result = await taskService.getTaskById('task-uuid-1');

    expect(tasksRepository.findById).toHaveBeenCalledWith('task-uuid-1');
    expect(result.id).toBe('task-uuid-1');
    expect(result.intern_name).toBe('Nguyễn Văn A');
    
    // Kiểm tra các trường chi tiết
    expect(result.submission_link).toBe('https://github.com/intern/pr/1');
    expect(result.mentor_feedback).toBe('Tốt, cần cải thiện responsive');
    
    // Kiểm tra file đính kèm
    expect(result.attachments).toHaveLength(1);
    expect(result.attachments[0]).toMatchObject({
      file_name: 'design_spec.pdf',
      type: 'MENTOR_DOC',
    });
  });

  // ──────────────────────────────────────────────────────────
  // TC14 - getAllInterns
  // ──────────────────────────────────────────────────────────
  it('TC14 - getAllInterns: Lấy danh sách thực tập sinh theo status', async () => {
    vi.mocked(internRepository.findAll).mockResolvedValue(mockInternsList as any);

    const result = await internService.getAllInterns('ACTIVE');

    expect(internRepository.findAll).toHaveBeenCalledWith('ACTIVE');
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ status: 'ACTIVE', full_name: 'Nguyễn Văn A' });
    expect(result[1]).toMatchObject({ status: 'ACTIVE', full_name: 'Trần Thị B' });
  });

  // ──────────────────────────────────────────────────────────
  // TC15 - getInternById
  // ──────────────────────────────────────────────────────────
  it('TC15 - getInternById: Throw error khi không tìm thấy thực tập sinh', async () => {
    // Trả về null giả lập không tìm thấy dữ liệu
    vi.mocked(internRepository.findByIdWithTasks).mockResolvedValue(null);

    await expect(
      internService.getInternById('non-existent-id')
    ).rejects.toThrow('Không tìm thấy thực tập sinh');

    expect(internRepository.findByIdWithTasks).toHaveBeenCalledWith('non-existent-id');
  });
});
