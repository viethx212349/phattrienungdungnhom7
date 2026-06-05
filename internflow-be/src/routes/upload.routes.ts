import { Router, Request, Response } from 'express';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// POST /api/upload - Upload 1 file
router.post('/', upload.single('file'), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
      return;
    }

    // Trả về URL để truy cập file tĩnh
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
      success: true,
      data: {
        url: fileUrl,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
