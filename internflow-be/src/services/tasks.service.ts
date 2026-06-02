import { task_status } from '@prisma/client';
import { tasksRepository } from '../repositories/tasks.repository';
import { internRepository } from '../repositories/intern.repository';

type TaskDisplayStatus =
  | 'UNASSIGNED'
  | 'IN_PROGRESS'
  | 'NEEDS_REVISION'
  | 'WAITING_REVIEW'
  | 'COMPLETED'
  | 'OVERDUE';

type TaskStatus = task_status;

type TaskFilters = {
  status?: TaskStatus;
  internId?: string;
  keyword?: string;
};

type TaskSummary = {
  id: string;
  title: string;
  description: string | null;
  intern_id: string | null;
  intern_name: string | null;
  status: TaskStatus;
  display_status: TaskDisplayStatus;
  rejected_count: number;
  due_date: Date | null;
  assigned_at: Date | null;
  submitted_at: Date | null;
  closed_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type TaskDetail = TaskSummary & {
  submission_link: string | null;
  submission_summary: string | null;
  mentor_feedback: string | null;
  attachments: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_size: bigint | null;
    type: string;
    created_at: Date;
  }>;
};

const computeTaskDisplayStatus = (
  status: TaskStatus,
  rejected_count: number,
  submitted_at: Date | null
): TaskDisplayStatus => {
  if (status === 'TODO') {
    return 'UNASSIGNED';
  }

  if (status === 'IN_PROGRESS') {
    return rejected_count > 0 ? 'NEEDS_REVISION' : 'IN_PROGRESS';
  }

  if (status === 'IN_REVIEW') {
    return 'WAITING_REVIEW';
  }

  if (status === 'DONE') {
    return submitted_at !== null ? 'COMPLETED' : 'OVERDUE';
  }

  return 'UNASSIGNED';
};

const mapTaskSummary = (task: any): TaskSummary => ({
  id: task.id,
  title: task.title,
  description: task.description ?? null,
  intern_id: task.intern_id ?? null,
  intern_name: task.interns?.full_name ?? null,
  status: task.status,
  display_status: computeTaskDisplayStatus(task.status, task.rejected_count, task.submitted_at),
  rejected_count: task.rejected_count,
  due_date: task.due_date,
  assigned_at: task.assigned_at,
  submitted_at: task.submitted_at,
  closed_at: task.closed_at,
  created_at: task.created_at,
  updated_at: task.updated_at
});

const mapTaskDetail = (task: any): TaskDetail => ({
  ...mapTaskSummary(task),
  submission_link: task.submission_link ?? null,
  submission_summary: task.submission_summary ?? null,
  mentor_feedback: task.mentor_feedback ?? null,
  attachments: (task.task_attachments ?? []).map((attachment: any) => ({
    id: attachment.id,
    file_name: attachment.file_name,
    file_url: attachment.file_url,
    file_size: attachment.file_size,
    type: attachment.type,
    created_at: attachment.created_at
  }))
});

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isPastDate = (date: Date): boolean => {
  return date.getTime() < new Date().getTime();
};

const ensureActiveIntern = async (internId: string) => {
  const intern = await internRepository.findById(internId);
  if (!intern || intern.status !== 'ACTIVE') {
    throw new Error('Intern không tồn tại hoặc không ACTIVE');
  }
  return intern;
};

export const taskService = {
  getAllTasks: async (filters: TaskFilters) => {
    const tasks = await tasksRepository.findAll(filters);
    return tasks.map(mapTaskSummary);
  },

  getTasksKanban: async () => {
    const tasks = await tasksRepository.findAll();
    return {
      TODO: tasks.filter((task) => task.status === 'TODO').map(mapTaskSummary),
      IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS').map(mapTaskSummary),
      IN_REVIEW: tasks.filter((task) => task.status === 'IN_REVIEW').map(mapTaskSummary),
      DONE: tasks.filter((task) => task.status === 'DONE').map(mapTaskSummary)
    };
  },

  getTaskById: async (id: string) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new Error('Không tìm thấy task');
    }
    return mapTaskDetail(task);
  },

  getReviewTasks: async () => {
    const tasks = await tasksRepository.findAll({ status: 'IN_REVIEW' });
    return tasks.map(mapTaskSummary);
  },

  approveTask: async (id: string, data: { mentor_feedback?: string }) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new Error('Không tìm thấy task');
    }
    if (task.status !== 'IN_REVIEW') {
      throw new Error('Chỉ task IN_REVIEW mới có thể approve');
    }

    const updated = await tasksRepository.update(id, {
      status: 'DONE',
      closed_at: new Date(),
      mentor_feedback: data.mentor_feedback?.trim() || null
    });
    return mapTaskDetail(updated);
  },

  rejectTask: async (id: string, data: { mentor_feedback?: string }) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new Error('Không tìm thấy task');
    }
    if (task.status !== 'IN_REVIEW') {
      throw new Error('Chỉ task IN_REVIEW mới có thể reject');
    }

    const feedback = data.mentor_feedback?.trim();
    if (!feedback) {
      throw new Error('Feedback của Mentor là bắt buộc khi Reject');
    }

    const updated = await tasksRepository.update(id, {
      status: 'IN_PROGRESS',
      rejected_count: task.rejected_count + 1,
      mentor_feedback: feedback,
      submission_link: null,
      submission_summary: null,
      submitted_at: null,
      closed_at: null
    });
    return mapTaskSummary(updated);
  },

  createTask: async (data: {
    title?: string;
    description?: string;
    intern_id?: string;
    due_date?: unknown;
  }) => {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Title là bắt buộc');
    }

    const now = new Date();
    const dueDate = parseDate(data.due_date);

    if (data.intern_id) {
      if (!dueDate) {
        throw new Error('due_date là bắt buộc khi gán intern');
      }
      if (isPastDate(dueDate)) {
        throw new Error('due_date không được là ngày trong quá khứ');
      }
      await ensureActiveIntern(data.intern_id);
      const task = await tasksRepository.create({
        title: data.title.trim(),
        description: data.description?.trim() ?? null,
        status: 'IN_PROGRESS',
        intern_id: data.intern_id,
        due_date: dueDate,
        assigned_at: now
      });
      return mapTaskSummary(task);
    }

    const task = await tasksRepository.create({
      title: data.title.trim(),
      description: data.description?.trim() ?? null,
      status: 'TODO'
    });
    return mapTaskSummary(task);
  },

  assignTask: async (id: string, data: { intern_id?: string; due_date?: unknown }) => {
    if (!data.intern_id) {
      throw new Error('intern_id là bắt buộc');
    }
    const dueDate = parseDate(data.due_date);
    if (!dueDate) {
      throw new Error('due_date là bắt buộc');
    }
    if (isPastDate(dueDate)) {
      throw new Error('due_date không được là ngày quá khứ');
    }

    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new Error('Không tìm thấy task');
    }
    if (task.status !== 'TODO') {
      throw new Error('Chỉ task TODO mới được assign');
    }

    await ensureActiveIntern(data.intern_id);
    const updated = await tasksRepository.update(id, {
      intern_id: data.intern_id,
      due_date: dueDate,
      assigned_at: new Date(),
      status: 'IN_PROGRESS'
    });
    return mapTaskSummary(updated);
  },

  updateTask: async (id: string, data: {
    title?: string;
    description?: string;
    due_date?: unknown;
    mentor_feedback?: string;
  }) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new Error('Không tìm thấy task');
    }

    if (task.status === 'DONE') {
      throw new Error('Không được sửa task DONE');
    }
    if (task.status === 'IN_REVIEW') {
      throw new Error('Không được sửa task IN_REVIEW');
    }
    if (task.status === 'IN_PROGRESS' && task.submitted_at !== null) {
      throw new Error('Không được sửa task IN_PROGRESS sau khi đã nộp bài');
    }

    const updateData: {
      title?: string;
      description?: string | null;
      due_date?: Date | null;
      mentor_feedback?: string | null;
    } = {};

    if (data.title !== undefined) {
      if (data.title.trim().length === 0) {
        throw new Error('Title không được để trống');
      }
      updateData.title = data.title.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }

    if (data.mentor_feedback !== undefined) {
      updateData.mentor_feedback = data.mentor_feedback.trim() || null;
    }

    if (data.due_date !== undefined) {
      const dueDate = parseDate(data.due_date);
      if (!dueDate) {
        updateData.due_date = null;
      } else {
        if (isPastDate(dueDate)) {
          throw new Error('due_date không được là ngày quá khứ');
        }
        updateData.due_date = dueDate;
      }
    }

    const updated = await tasksRepository.update(id, updateData);
    return mapTaskSummary(updated);
  },

  deleteTask: async (id: string) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new Error('Không tìm thấy task');
    }
    if (task.status !== 'TODO') {
      throw new Error('Chỉ được xóa task TODO');
    }
    await tasksRepository.delete(id);
    return { id };
  }
};
