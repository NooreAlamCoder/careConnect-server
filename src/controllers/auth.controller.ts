import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production';

export const createJWT = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const payload: IAuthPayload = {
      email,
      name: name || '',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate token',
    });
  }
};


// Session exchange controller
