import { Router } from 'express';
import {
  getRecentEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  joinEvent,
  getMyJoinedEvents,
} from '../controllers/event.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/recent', getRecentEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEventById);

// Protected Routes (Requires JWT Verification)
router.post('/', verifyJWT, createEvent);
router.get('/user/my-events', verifyJWT, getMyEvents);
router.put('/:id', verifyJWT, updateEvent);
router.delete('/:id', verifyJWT, deleteEvent);

// Joined Event Operations (Requires JWT Verification)
router.post('/action/join', verifyJWT, joinEvent);
router.get('/user/joined-by-me', verifyJWT, getMyJoinedEvents);

export default router;

