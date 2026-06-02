import { prisma } from '../lib/prisma';
import { task_status } from '@prisma/client';

type TaskStatus = task_status;

type TaskFilters = {
  status?: TaskStatus;
  internId?: string;
  keyword?: string;
};

export const tasksRepository = {
  findAll: async (filters?: TaskFilters) => {
    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.internId) {
      where.intern_id = filters.internId;
    }
    if (filters?.keyword) {
      where.OR = [
        { title: { contains: filters.keyword, mode: 'insensitive' } },
        { description: { contains: filters.keyword, mode: 'insensitive' } }
      ];
    }

    return await prisma.tasks.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        intern_id: true,
        status: true,
        rejected_count: true,
        due_date: true,
        assigned_at: true,
        submitted_at: true,
        closed_at: true,
        created_at: true,
        updated_at: true,
        interns: {
          select: {
            id: true,
            full_name: true
          }
        }
      }
    });
  },

  findById: async (id: string) => {
    return await prisma.tasks.findUnique({
      where: { id },
      include: {
        interns: {
          select: {
            id: true,
            full_name: true,
            email: true,
            position: true,
            phone: true,
            school: true,
            status: true
          }
        },
        task_attachments: {
          select: {
            id: true,
            file_name: true,
            file_url: true,
            file_size: true,
            type: true,
            created_at: true
          }
        }
      }
    });
  },

  create: async (data: {
    title: string;
    description?: string | null;
    status: TaskStatus;
    intern_id?: string | null;
    due_date?: Date | null;
    assigned_at?: Date | null;
  }) => {
    return await prisma.tasks.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        status: data.status,
        intern_id: data.intern_id ?? null,
        due_date: data.due_date ?? null,
        assigned_at: data.assigned_at ?? null
      }
    });
  },

  update: async (id: string, data: {
    title?: string;
    description?: string | null;
    due_date?: Date | null;
    mentor_feedback?: string | null;
    intern_id?: string | null;
    assigned_at?: Date | null;
    status?: TaskStatus;
    rejected_count?: number;
    submission_link?: string | null;
    submission_summary?: string | null;
    submitted_at?: Date | null;
    closed_at?: Date | null;
  }) => {
    return await prisma.tasks.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        due_date: data.due_date,
        mentor_feedback: data.mentor_feedback,
        intern_id: data.intern_id,
        assigned_at: data.assigned_at,
        status: data.status,
        rejected_count: data.rejected_count,
        submission_link: data.submission_link,
        submission_summary: data.submission_summary,
        submitted_at: data.submitted_at,
        closed_at: data.closed_at
      },
      include: {
        interns: {
          select: {
            id: true,
            full_name: true,
            email: true,
            position: true,
            phone: true,
            school: true,
            status: true
          }
        },
        task_attachments: {
          select: {
            id: true,
            file_name: true,
            file_url: true,
            file_size: true,
            type: true,
            created_at: true
          }
        }
      }
    });
  },

  delete: async (id: string) => {
    return await prisma.tasks.delete({
      where: { id }
    });
  }
};



