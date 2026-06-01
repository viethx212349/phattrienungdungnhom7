// ========================
// Route Layer (Tầng 1 - Controller/Router)
// ========================
// Nhận request từ client, validate input, gọi Service layer
// Không chứa business logic
//
// Ví dụ: intern.routes.ts sẽ nằm ở đây
// ========================
// Routes/Controller Layer (Tầng API)
// Nhận request, gọi service, trả response
// KHÔNG chứa logic nghiệp vụ hay truy vấn database trực tiếp
// ========================

import { Router, Request, Response } from 'express';
import { internService } from '../services/intern.service';

const router = Router();

// GET /api/interns - Lấy tất cả
router.get('/', async (req: Request, res: Response) => {
  try {
    const interns = await internService.getAllInterns();
    res.json({ success: true, data: interns });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/interns/:id - Lấy theo id
// tức là GET /api/interns/12345 sẽ lấy thực tập sinh có id là 12345
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const interns = await internService.getInternById(id);
    res.json({ success: true, data: interns });
  } catch (error) {
    const err = error as Error;
    res.status(404).json({ success: false, message: err.message });
  }
});

// POST /api/interns - Tạo mới
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const newIntern = await internService.createIntern({ name, email });
    res.status(201).json({ success: true, data: newIntern });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/interns/:id - Cập nhật
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, email } = req.body;
    const updated = await internService.updateIntern(id, { name, email });
    res.json({ success: true, data: updated });
  } catch (error) {
    const err = error as Error;
    const status = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
});

// DELETE /api/interns/:id - Xóa
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await internService.deleteIntern(id);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    const err = error as Error;
    res.status(404).json({ success: false, message: err.message });
  }
});

export default router;