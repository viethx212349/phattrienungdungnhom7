// ========================
// Service Layer (Tầng 2 - Business Logic)
// ========================
// Chứa business logic, xử lý nghiệp vụ
// Gọi Repository layer để truy vấn database
// Không biết về HTTP request/response
//
// Ví dụ: intern.service.ts sẽ nằm ở đây
// ========================
// Service Layer (Tầng Business Logic)
// Xử lý logic nghiệp vụ, validation, gọi repository
// Không tiếp xúc trực tiếp với database
// ========================

import { internRepository } from '../repositories/.gitkeep';

export const internService = {
  // Lấy tất cả thực tập sinh
  getAllInterns: async () => {
    return await internRepository.findAll();
  },
  
  // Lấy thực tập sinh theo id
  getInternById: async (id: number) => {
    const intern = await internRepository.findById(id);
    if (!intern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }
    return intern;
  },
  
  // Tạo thực tập sinh mới (có validation)
  createIntern: async (data: { name: string; email: string }) => {
    // Business logic: validation
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Tên không được để trống');
    }
    
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Email không hợp lệ');
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingIntern = await internRepository.findByEmail(data.email);
    if (existingIntern) {
      throw new Error('Email đã được đăng ký');
    }
    
    // Gọi repository để lưu
    return await internRepository.create(data);
  },
  
  // Cập nhật thực tập sinh
  updateIntern: async (id: number, data: { name?: string; email?: string }) => {
    // Kiểm tra tồn tại
    const existingIntern = await internRepository.findById(id);
    if (!existingIntern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }
    
    // Nếu đổi email, kiểm tra email mới chưa được dùng
    if (data.email && data.email !== existingIntern.email) {
      const emailExists = await internRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error('Email đã được đăng ký bởi người khác');
      }
    }
    
    return await internRepository.update(id, data);
  },
  
  // Xóa thực tập sinh
  deleteIntern: async (id: number) => {
    const existingIntern = await internRepository.findById(id);
    if (!existingIntern) {
      throw new Error('Không tìm thấy thực tập sinh');
    }
    
    return await internRepository.delete(id);
  }
};