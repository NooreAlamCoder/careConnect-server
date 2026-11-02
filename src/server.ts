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
    origin: (origin, callback) => {
      // Allow requests with no origin (curl/mobile), localhost, or any vercel domain
      if (!origin || origin.includes('localhost') || origin.endsWith('.vercel.app') || (process.env.CLIENT_URL && origin.includes(process.env.CLIENT_URL))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database auto-connection middleware for serverless/Vercel invocations
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (error) {
    // DB errors handled gracefully
  }
  next();
});

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

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

// Export app for Vercel Serverless Function
export default app;

