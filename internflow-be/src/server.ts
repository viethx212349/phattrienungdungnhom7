import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import internRoutes from './routes/intern.routes';
import {internService} from './services/intern.service';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());

// ========================
// Routes (sẽ thêm sau)
// ========================
// import internRoutes from './routes/intern.routes';
app.use('/api/interns', internRoutes);


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
});

export default app;
