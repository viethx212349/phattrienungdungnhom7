// ========================
// Repository Layer (Tầng Data Access)
// Chỉ chứa các function CRUD, không có logic nghiệp vụ
// ========================

import { prisma } from '../lib/prisma';

export const internRepository = {
  // Tìm tất cả
  findAll: async () => {
    return await prisma.intern.findMany();
  },
  
  // Tìm theo id
  findById: async (id: number) => {
    return await prisma.intern.findUnique({
      where: { id }
    });
  },
  
  // Tìm theo email
  findByEmail: async (email: string) => {
    return await prisma.intern.findUnique({
      where: { email }
    });
  },
  
  // Tạo mới
  create: async (data: { name: string; email: string }) => {
    return await prisma.intern.create({
      data: {
        ...data,
        startDate: new Date()
      }
    });
  },
  
  // Cập nhật
  update: async (id: number, data: { name?: string; email?: string }) => {
    return await prisma.intern.update({
      where: { id },
      data
    });
  },
  
  // Xóa
  delete: async (id: number) => {
    return await prisma.intern.delete({
      where: { id }
    });
  }
};