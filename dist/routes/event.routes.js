"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.get('/recent', event_controller_1.getRecentEvents);
router.get('/upcoming', event_controller_1.getUpcomingEvents);
router.get('/:id', event_controller_1.getEventById);
// Protected Routes (Requires JWT Verification)
router.post('/', auth_middleware_1.verifyJWT, event_controller_1.createEvent);
router.get('/user/my-events', auth_middleware_1.verifyJWT, event_controller_1.getMyEvents);
router.put('/:id', auth_middleware_1.verifyJWT, event_controller_1.updateEvent);
router.delete('/:id', auth_middleware_1.verifyJWT, event_controller_1.deleteEvent);
// Joined Event Operations (Requires JWT Verification)
router.post('/action/join', auth_middleware_1.verifyJWT, event_controller_1.joinEvent);
router.get('/user/joined-by-me', auth_middleware_1.verifyJWT, event_controller_1.getMyJoinedEvents);
exports.default = router;
