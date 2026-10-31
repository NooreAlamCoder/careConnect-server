import { Request, Response } from 'express';

export const getHealthStatus = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Social Development Events Platform Server',
  });
};

