# InternFlow

## 1. Thông tin nhóm

- **Môn học:** AC3030 – Phát triển ứng dụng
- **Học kỳ:** 20252
- **Nhóm:** Nhóm 7

## 2. Mô tả ngắn

InternFlow là một phần mềm Desktop (Internal HR System) được thiết kế chuyên biệt để giúp các Mentor/Người quản lý theo dõi và đánh giá quá trình làm việc của thực tập sinh (Intern).

**Chức năng chính:**

- Quản lý quy trình giao việc và nộp bài theo mô hình Kanban Board (TODO, IN_PROGRESS, IN_REVIEW, DONE).
- Sắp xếp độ ưu tiên Task thông minh (ưu tiên deadline cận nhất, task mới tạo).
- Duyệt (Approve) hoặc Từ chối (Reject) bài nộp của Intern kèm hệ thống tự động lưu vết (rejected count).
- Đánh giá năng lực cuối kỳ (Passed/Failed) và xuất báo cáo.
- Hệ thống tự động nhắc nhở (Scheduler) đóng task quá hạn.

## 3. Công nghệ sử dụng

- **Language:** TypeScript,javascript
- **Framework:** Electron 36, React 19, Vite (Frontend) | Express.js (Backend)
- **Database:** PostgreSQL (hosted trên Supabase) + Prisma ORM
- **Test framework:** Vitest (`@vitest/coverage-v8`)
- **Build/deploy:** `electron-builder` (Đóng gói ứng dụng thành file `.exe` cho Windows)

## 4. Cách chạy bản deploy (Ứng dụng Desktop)

### 4.1. Yêu cầu môi trường

- **OS:** Windows 10/11 (64-bit)
- **Runtime:** Không yêu cầu cài đặt Node.js (Ứng dụng đã được đóng gói độc lập). Máy tính cần có kết nối Internet để kết nối tới Cloud Database.
- **Database:** Hệ thống đã tự động kết nối đến Cloud Database (Supabase PostgreSQL) qua connection string nội bộ.

### 4.2. Các bước chạy

⚠️ **Quan trọng:** Ứng dụng Desktop (Frontend) yêu cầu phải có API Server (Backend) chạy ngầm để lấy dữ liệu.

**Bước 1: Khởi chạy Backend API**

- Mở Terminal tại thư mục `internflow-be`
- Chạy lệnh `npm install`
- Chạy lệnh `npm run setup` (Lưu ý: Lệnh này tự động copy link Database từ file `.env.example` sang `.env`. Nhóm đã chủ ý để sẵn password DB thực tế vào file `.env.example` nhằm mục đích giúp dễ dàng chạy thử mà không phải mất thời gian tự setup môi trường).
- Chạy lệnh `npm run start` (hoặc `npm run dev`). Đảm bảo Server báo chạy thành công ở cổng 4000.

**Bước 2: Mở Frontend Desktop App**

1. Tải file `InternFlow Setup 1.0.0` do nhóm cung cấp (từ thư mục /Release).
2. Click đúp vào file `.exe` để tiến hành cài đặt.
3. Mở phần mềm `InternFlow` từ màn hình Desktop hoặc Start Menu. Lúc này App sẽ tự động kết nối với Backend ở Bước 1.

### 4.3. Tài khoản demo

Phần mềm được thiết kế dành riêng cho máy tính cá nhân của một Mentor, do đó hệ thống **không yêu cầu đăng nhập (No Authentication)**. Mở app là có thể sử dụng trực tiếp quyền quản trị cao nhất để thao tác với dữ liệu.

## 5. Cách chạy từ source

Hệ thống được tổ chức theo cấu trúc Monorepo. Cần mở 2 terminal để chạy song song Backend và Frontend.

**Khởi chạy Backend (API Server):**

```bash
cd internflow-be
npm install
# Tạo file .env tự động (có sẵn link Database) và generate Prisma Client
npm run setup
npm run dev
```

_(Backend sẽ chạy ở địa chỉ http://localhost:4000)_

**Khởi chạy Frontend (Electron Desktop App):**

```bash
cd internflow-fe
npm install
npm run dev
```

_(Giao diện Desktop App sẽ khởi động. Vite chạy ngầm proxy API sang cổng 4000)_

## 6. Cách chạy test

Hệ thống sử dụng Vitest để Unit Test toàn bộ Business Logic ở tầng Service của Backend.

```bash
cd internflow-be

# Chạy Unit Test (20 Test Cases)
npm run test

# Chạy test và xuất báo cáo độ phủ mã (Coverage Report)
npm run test:coverage
```

## 7. Cấu trúc thư mục

```text
phattrienungdungnhom7-monorepo/
├── internflow-be/               # Backend API
│   ├── prisma/                  # Schema Database (Prisma)
│   ├── src/
│   │   ├── lib/                 # Prisma config, Scheduler logic
│   │   ├── repositories/        # Database access layer (Repository Pattern)
│   │   ├── routes/              # HTTP API endpoints
│   │   ├── services/            # Business logic (Service Pattern)
│   │   └── tests/               # Vitest unit test files
│   └── uploads/                 # Lưu trữ file attachments local
├── internflow-fe/               # Frontend Desktop App
│   ├── electron/                # Main process & IPC Bridge preload
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── features/tasks/      # Kanban board & Task modals
│   │   ├── lib/api.ts           # Native Fetch API wrapper
│   │   └── pages/               # Giao diện chính (Dashboard, List)
├── TestEvidenceNhom7/           # Thư mục chứa hình ảnh báo cáo Test
└── mockupinternflow/            # Chứa ảnh mockup UI giai đoạn thiết kế
```

## 8. Ghi chú lỗi thường gặp

| Lỗi                                                             | Cách xử lý                                                                                                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Màn hình ứng dụng trắng tinh (White screen) trên Windows cũ** | Hệ điều hành không hỗ trợ GPU Acceleration. Đã fix trong `main.ts` bằng lệnh `app.disableHardwareAcceleration()`. Nếu vẫn bị, hãy cập nhật driver màn hình.  |
| **Prisma Client báo lỗi không tìm thấy model (table)**          | Chạy lệnh `npx prisma generate` trong thư mục `internflow-be` để sinh lại schema TypeScript.                                                                 |
| **Giao diện FE không tải được dữ liệu, hiện Skeleton mãi**      | Đảm bảo Backend (port 4000) đang chạy. Nếu chạy production build, hãy check lại file config API URL.                                                         |
| **Lỗi tải file đính kèm từ task**                               | Các file đính kèm được host tại local backend `http://localhost:4000/uploads/...`. Đảm bảo backend đã khởi động.                                             |
| **Lỗi Timeout kết nối CSDL (Supabase PgBouncer)**               | Do quá trình Dev khởi động lại liên tục gây cạn pool connection ở port 6543. Vui lòng đợi khoảng 15-30 giây để Supabase tự giải phóng connection và thử lại. |
