import { Router } from 'express';
import { createJWT } from '../controllers/auth.controller';

const router = Router();

router.post('/jwt', createJWT);

export default router;

