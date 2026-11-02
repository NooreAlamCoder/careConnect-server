import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { allowedOrigins } from './config/cors';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';

import { getHealthStatus } from './controllers/health.controller';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Route
app.get('/', getHealthStatus);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server and Connect DB
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
  } catch (error) {
    console.warn('⚠️ Server started in offline/standby mode for DB. Update server/.env with your MongoDB URI to enable database queries.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

startServer();


// 10mb body parser limit
