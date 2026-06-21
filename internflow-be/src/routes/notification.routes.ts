import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

const router = Router();

// Lấy danh sách thông báo (tuỳ chọn lọc theo internId)
router.get('/', async (req: Request, res: Response) => {
  try {
    const internId = req.query.internId as string | undefined;
    const notifications = await notificationService.getNotifications(internId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

// Lấy số thông báo chưa đọc
router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const internId = req.query.internId as string | undefined;
    const count = await notificationService.getUnreadCount(internId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

// Đánh dấu tất cả đã đọc (tuỳ chọn theo internId)
router.patch('/read-all', async (req: Request, res: Response) => {
  try {
    const { internId } = req.body;
    await notificationService.markAllAsRead(internId);
    res.json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

// Đánh dấu một thông báo đã đọc
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const notification = await notificationService.markAsRead(id);
    res.json({ success: true, data: notification });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
