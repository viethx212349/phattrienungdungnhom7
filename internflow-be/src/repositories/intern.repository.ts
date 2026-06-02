import { prisma } from '../lib/prisma';

type InternStatus = 'ACTIVE' | 'PASSED' | 'FAILED';


// tìm theo thực tập sinh .
export const internRepository = {
  // Tìm tất cả intern, có thể lọc theo status
  findAll: async (status?: InternStatus) => {
    const where = status ? { status } : undefined;
    return await prisma.interns.findMany({
      where,
      orderBy: { full_name: 'asc' },
      select: {
        id: true,
        full_name: true,
        intern_code: true,
        position: true,
        email: true,
        phone: true,
        school: true,
        status: true,
        final_feedback: true
      }
    });
  },

  // Tìm theo id cơ bản
  findById: async (id: string) => {
    return await prisma.interns.findUnique({
      where: { id }
    });
  },

  // Tìm theo id và lấy chi tiết task
  findByIdWithTasks: async (id: string) => {
    return await prisma.interns.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: [{ due_date: 'asc' }, { created_at: 'asc' }]
        }
      }
    });
  },

  // Tìm theo email
  findByEmail: async (email: string) => {
    return await prisma.interns.findFirst({
      where: { email }
    });
  },

  // Tạo mới
  create: async (data: { name: string; email: string }) => {
    const internCode = `INT-${Date.now().toString().slice(-6)}`;
    return await prisma.interns.create({
      data: {
        full_name: data.name,
        email: data.email,
        intern_code: internCode
      }
    });
  },

  // Cập nhật thông tin intern
  update: async (id: string, data: { name?: string; email?: string }) => {
    const updateData: { full_name?: string; email?: string } = {};
    if (data.name) updateData.full_name = data.name;
    if (data.email) updateData.email = data.email;
    return await prisma.interns.update({
      where: { id },
      data: updateData
    });
  },

  // Cập nhật trạng thái học viên và final feedback
  updateStatus: async (id: string, data: { status: InternStatus; final_feedback?: string | null }) => {
    return await prisma.interns.update({
      where: { id },
      data: {
        status: data.status,
        final_feedback: data.final_feedback
      }
    });
  },

  // Xóa
  delete: async (id: string) => {
    return await prisma.interns.delete({
      where: { id }
    });
  }
};



