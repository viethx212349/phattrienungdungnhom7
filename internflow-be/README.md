# InternFlow Backend

Backend API cho hệ thống quản lý thực tập sinh InternFlow.

**Tech Stack:** Node.js, Express, TypeScript, Prisma ORM, Supabase (PostgreSQL)

---

## 🚀 Hướng dẫn Setup (Cho anh em mới clone code)

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Tạo file .env (QUAN TRỌNG)

**Cách nhanh nhất — chạy script setup:**
```bash
npm run setup
```
Script sẽ tự động copy file `.env.example` thành `.env` và generate Prisma Client. 

*(Ghi chú cho Giám khảo: Mật khẩu kết nối Database thực tế đã được nhóm chủ ý để sẵn trong file `.env.example` thay vì giấu đi. Mục đích là để Thầy/Cô có thể chạy lệnh `npm run setup` và chấm đồ án ngay lập tức mà không cần tốn thời gian điền password cấu hình môi trường).*

**Hoặc làm thủ công:**
1. Copy file `.env.example` thành `.env` (File này đã được gắn sẵn DB URL của nhóm).
2. Chạy `npx prisma generate`

### Bước 3: Chạy server
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:4000`

---

## 📋 Scripts

| Script | Mô tả |
|--------|--------|
| `npm run setup` | Tạo file .env tự động |
| `npm run dev` | Chạy server development (hot reload) |
| `npm run build` | Build TypeScript |
| `npm start` | Chạy production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:pull` | Pull schema từ database |
| `npm run prisma:studio` | Mở Prisma Studio (GUI quản lý DB) |

---

## ⚠️ Lưu ý quan trọng

- **KHÔNG commit file `.env`** lên Git (đã được gitignore)
- File `.env` chứa mật khẩu database, chỉ chia sẻ qua kênh riêng tư
- Nếu gặp lỗi kết nối database, kiểm tra lại mật khẩu trong `.env`
