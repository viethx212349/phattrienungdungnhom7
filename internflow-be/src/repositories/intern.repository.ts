import { prisma } from '../lib/prisma';

export const internRepository = {
  // Tìm tất cả
  findAll: async () => {
    return await prisma.interns.findMany();
  },
  
  // Tìm theo id
  findById: async (id: string) => {
    return await prisma.interns.findUnique({
      where: { id }
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
  
  // Cập nhật
  update: async (id: string, data: { name?: string; email?: string }) => {
    const updateData: { full_name?: string; email?: string } = {};
    if (data.name) updateData.full_name = data.name;
    if (data.email) updateData.email = data.email;
    return await prisma.interns.update({
      where: { id },
      data: updateData
    });
  },
  
  // Xóa
  delete: async (id: string) => {
    return await prisma.interns.delete({
      where: { id }
    });
  }
};