# InternFlow - Monorepo

Đây là repository chung cho toàn bộ dự án InternFlow (SaaS-like Internal Human Resource Management System).

Dự án được thiết kế theo kiến trúc **Client-Server** với cấu trúc **Monorepo**:

## Cấu trúc thư mục

```text
phattrienungdungnhom7/
│
├── internflow-fe/        # Frontend Repository (Desktop App)
│   # Công nghệ: Electron, React 18, TypeScript, Vite, Tailwind CSS
│   # Dành cho Mentor Desktop App UI
│
├── internflow-be/        # Backend Repository (API Server)
│   # Công nghệ: Node.js, Express, TypeScript, Prisma ORM
│   # Dành cho Backend API, kết nối với Supabase Database
│
└── README.md             # Tài liệu dự án
```

## Cách chạy dự án

### 1. Database (Supabase)
Dự án sử dụng PostgreSQL host trên Supabase. Bạn cần được cấp quyền hoặc có chuỗi kết nối (Connection String) từ trưởng nhóm.

### 2. Backend API
1. Đi tới thư mục backend: `cd internflow-be`
2. Cài đặt dependencies: `npm install`
3. Tạo file `.env` dựa trên `.env.example` và điền thông tin database
4. Chạy môi trường dev: `npm run dev`

### 3. Frontend App
1. Đi tới thư mục frontend: `cd internflow-fe`
2. Cài đặt dependencies: `npm install`
3. Chạy môi trường dev: `npm run dev`

## Quy tắc đóng góp (Contributing)
- Luôn kiểm tra xem bạn đang ở thư mục FE hay BE trước khi cài đặt package hoặc viết code.
- Mỗi commit nên prefix rõ ràng ảnh hưởng đến phần nào (vd: `feat(fe): ...` hoặc `fix(be): ...`).
