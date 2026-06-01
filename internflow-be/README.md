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
Script sẽ hỏi mật khẩu database → tự tạo file `.env` → tự generate Prisma Client.

> 💡 **Mật khẩu database hỏi nhóm trưởng** (chỉ cần nhập 1 lần duy nhất)

**Hoặc làm thủ công:**
1. Copy file `.env.example` thành `.env`
2. Thay `[YOUR-PASSWORD]` bằng mật khẩu thật
3. Chạy `npx prisma generate`

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
