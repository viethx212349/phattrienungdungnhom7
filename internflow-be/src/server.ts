import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import internRoutes from './routes/intern.routes';
import taskRoutes from './routes/tasks.routes';
import uploadRoutes from './routes/upload.routes';
import { startOverdueTaskScheduler } from './lib/scheduler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========================
// Routes
// ========================
app.use('/api/interns', internRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);


// ========================
// Health Check
// ========================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'InternFlow Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`🚀 InternFlow Backend running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  startOverdueTaskScheduler();
});

export default app;
