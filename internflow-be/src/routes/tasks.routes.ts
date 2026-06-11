import { Router, Request, Response } from 'express';
import { taskService } from '../services/tasks.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const internId = req.query.internId as string | undefined;
    const keyword = req.query.keyword as string | undefined;
    const tasks = await taskService.getAllTasks({
      status: status as any,
      internId,
      keyword
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/kanban', async (_req: Request, res: Response) => {
  try {
    const board = await taskService.getTasksKanban();
    res.json({ success: true, data: board });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/review', async (_req: Request, res: Response) => {
  try {
    const tasks = await taskService.getReviewTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { mentor_feedback } = req.body;
    const task = await taskService.approveTask(id, { mentor_feedback });
    res.json({ success: true, data: task });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
});

router.patch('/:id/reject', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { mentor_feedback } = req.body;
    const task = await taskService.rejectTask(id, { mentor_feedback });
    res.json({ success: true, data: task });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = await taskService.getTaskById(id);
    res.json({ success: true, data: task });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, intern_id, due_date, attachments } = req.body;
    const task = await taskService.createTask({
      title,
      description,
      intern_id,
      due_date,
      attachments
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/:id/assign', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { intern_id, due_date } = req.body;
    const task = await taskService.assignTask(id, { intern_id, due_date });
    res.json({ success: true, data: task });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, due_date, mentor_feedback, attachments } = req.body;
    const task = await taskService.updateTask(id, {
      title,
      description,
      due_date,
      mentor_feedback,
      attachments
    });
    res.json({ success: true, data: task });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await taskService.deleteTask(id);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('Không tìm thấy') ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
});

export default router;
