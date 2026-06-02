import { internRepository } from '../repositories/intern.repository';
import { task_status } from '@prisma/client';



const computeTaskDisplayStatus = (status: task_status, due_date: Date | null): string => {
  const now = new Date();
  const isOverdue = due_date !== null && due_date < now && status !== 'DONE';

  if (status === 'DONE') {
    return 'Hoàn thành';
  }

  if (status === 'IN_REVIEW') {
    return 'Chờ duyệt';
  }

  if (isOverdue) {
    return 'Trễ hạn';
  }

  if (status === 'IN_PROGRESS') {
    return 'Đang làm';
  }

  return 'Đang làm';
};




export const internService = {
  // Lấy tất cả thực tập sinh, có thể lọc theo status
  getAllInterns: async (status?: string) => {
    const validStatus = ['ACTIVE', 'PASSED', 'FAILED'] as const;
    const normalizedStatus = status && validStatus.includes(status.toUpperCase() as typeof validStatus[number])
      ? (status.toUpperCase() as 'ACTIVE' | 'PASSED' | 'FAILED')
      : undefined;
    return await internRepository.findAll(normalizedStatus);
  },






  // Lấy chi tiết intern theo id, kèm thống kê và lịch sử task
  getInternById: async (id: string) => {
    const intern = await internRepository.findByIdWithTasks(id);
    if (!intern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }

    const tasks = intern.tasks ?? [];
    const now = new Date();

    const total_tasks = tasks.length;
    const completed_count = tasks.filter((task) => task.status === 'DONE').length;
    const overdue_count = tasks.filter((task) => {
      return task.status !== 'DONE' && task.due_date !== null && task.due_date < now;
    }).length;
    const total_revisions = tasks.reduce((sum, task) => sum + task.rejected_count, 0);

    const task_history = tasks.map((task) => ({
      name: task.title,
      deadline: task.due_date,
      raw_status: task.status,
      display_status: computeTaskDisplayStatus(task.status, task.due_date),
      rejected_count: task.rejected_count,
      latest_feedback: task.mentor_feedback ?? null,
      submitted_at: task.submitted_at,
      closed_at: task.closed_at
    }));

    return {
      id: intern.id,
      full_name: intern.full_name,
      intern_code: intern.intern_code,
      position: intern.position,
      email: intern.email,
      phone: intern.phone,
      school: intern.school,
      status: intern.status,
      final_feedback: intern.final_feedback ?? null,
      total_tasks,
      completed_count,
      overdue_count,
      total_revisions,
      task_history
    };
  },






  // Chốt kết quả thực tập
  finalizeIntern: async (id: string, data: { status: string; final_feedback?: string }) => {
    const existingIntern = await internRepository.findById(id);
    if (!existingIntern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }

    const normalizedStatus = data.status?.toUpperCase();
    if (!['PASSED', 'FAILED'].includes(normalizedStatus)) {
      throw new Error('Status phải là PASSED hoặc FAILED');
    }

    return await internRepository.updateStatus(id, {
      status: normalizedStatus as 'PASSED' | 'FAILED',
      final_feedback: data.final_feedback ?? null
    });
  },





  // Tạo thực tập sinh mới (có validation)
  createIntern: async (data: { name: string; email: string }) => {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Tên không được để trống');
    }

    if (!data.email || !data.email.includes('@')) {
      throw new Error('Email không hợp lệ');
    }

    const existingIntern = await internRepository.findByEmail(data.email);
    if (existingIntern) {
      throw new Error('Email đã được đăng ký');
    }

    return await internRepository.create(data);
  },





  // Cập nhật thực tập sinh
  updateIntern: async (id: string, data: { name?: string; email?: string }) => {
    const existingIntern = await internRepository.findById(id);
    if (!existingIntern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }

    if (data.email && data.email !== existingIntern.email) {
      const emailExists = await internRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error('Email đã được đăng ký bởi người khác');
      }
    }

    return await internRepository.update(id, data);
  },





  // Xóa thực tập sinh
  deleteIntern: async (id: string) => {
    const existingIntern = await internRepository.findById(id);
    if (!existingIntern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }

    return await internRepository.delete(id);
  }
};