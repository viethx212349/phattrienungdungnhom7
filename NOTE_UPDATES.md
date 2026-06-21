# Báo cáo các chức năng đã cập nhật (InternFlow)

Tài liệu này ghi chú lại 2 phần cập nhật quan trọng: Đóng gói ứng dụng thành Desktop App (Electron) và Cải thiện trải nghiệm người dùng (UX) thông qua thuật toán sắp xếp.

---

## 1. Đóng gói ứng dụng bằng Electron
Ứng dụng frontend (React/Vite) đã được tích hợp thêm Electron để có thể chạy độc lập như một phần mềm Desktop hoàn chỉnh thay vì chỉ chạy trên Web browser.

**Những thay đổi cốt lõi:**
- Thêm `electron`, `vite-plugin-electron`, `electron-builder` vào `internflow-fe`.
- Khởi tạo thư mục `electron/` chứa file `main.ts` (quản lý Window/Lifecycle) và `preload.ts` (kết nối an toàn giữa React và Electron IPC).
- Chuyển đổi `BrowserRouter` thành `HashRouter` trong file `src/App.tsx` (bắt buộc để React Router hoạt động bình thường trên Desktop App khi load qua giao thức `file://`).
- Cấu hình tự động fix lỗi crash GPU trên một số máy Windows bằng `app.disableHardwareAcceleration()`.
- **Lệnh chạy Dev:** `npm run dev` tại thư mục `internflow-fe` sẽ tự động khởi động server Vite và bật cửa sổ Desktop Electron.
- **Lệnh build:** Đã cấu hình lệnh build ra file `.exe` (installer và portable) trong `package.json`. 

---

## 2. Cải thiện Logic sắp xếp (Sorting UX)
Cấu hình lại toàn bộ thuật toán sắp xếp (ở cả Backend và Frontend) nhằm đem lại trải nghiệm quản lý công việc và con người thực tế, chuyên nghiệp nhất.

**Tại Bảng Kanban (Dashboard):**
Thay vì gộp chung sắp xếp theo ngày tạo một cách máy móc, mỗi cột đã có logic riêng:
- **Cột TODO (Cần làm):** Sắp xếp ưu tiên các task mới tạo lên trên cùng (Dựa theo `createdAt` giảm dần).
- **Cột IN PROGRESS (Đang làm):** Ưu tiên các task sắp đến hạn chót (Deadline) hoặc đã trễ hạn lên trên cùng để nhắc nhở (Dựa theo `dueDate` tăng dần).
- **Cột IN REVIEW (Chờ duyệt):** Ưu tiên những task vừa được Intern nộp bài xong lên đầu để Mentor dễ thấy và vào duyệt ngay (Dựa theo `submittedAt` giảm dần).
- **Cột DONE (Hoàn thành):** Ưu tiên những task vừa được Mentor chấm xong (Dựa theo `closedAt` giảm dần). Những việc làm xong từ tháng trước sẽ dần bị chìm xuống dưới.

**Tại Danh sách Thực tập sinh (Interns):**
- Thay vì chỉ sắp xếp theo bảng chữ cái A-Z, hệ thống hiện tại ưu tiên hiển thị những Intern đang ở trạng thái **ACTIVE** (Đang hoạt động) lên đầu tiên.
- Sau đó ưu tiên những người mới được thêm vào hệ thống.
- Cuối cùng (nếu các tiêu chí trên trùng nhau) mới sắp xếp fallback theo bảng chữ cái A-Z.
