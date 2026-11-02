"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyJoinedEvents = exports.joinEvent = exports.deleteEvent = exports.updateEvent = exports.getMyEvents = exports.createEvent = exports.getEventById = exports.getUpcomingEvents = exports.getRecentEvents = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
// Helper to safely extract single string ID from Express 5 params
const extractParamId = (param) => {
    if (typeof param === 'string')
        return param;
    if (Array.isArray(param) && param.length > 0)
        return param[0];
    return '';
};
/**
 * 1. GET /api/events/recent
 * Returns 6 recent upcoming events using MongoDB .limit(6)
 */
const getRecentEvents = async (_req, res) => {
    try {
        const eventsCollection = (0, db_1.getEventsCollection)();
        const today = new Date().toISOString().split('T')[0];
        const recentEvents = await eventsCollection
            .find({ eventDate: { $gte: today } })
            .sort({ eventDate: 1 })
            .limit(6)
            .toArray();
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
        res.status(200).json({
            success: true,
            data: recentEvents,
        });
    }
    catch (error) {
        console.error('Error fetching recent events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent events',
        });
    }
};
exports.getRecentEvents = getRecentEvents;
/**
 * 2. GET /api/events/upcoming
 * Returns all upcoming events (filter: eventDate >= today)
 */
const getUpcomingEvents = async (req, res) => {
    try {
        const eventsCollection = (0, db_1.getEventsCollection)();
        const today = new Date().toISOString().split('T')[0];
        const { category, search } = req.query;
        const query = {
            eventDate: { $gte: today },
        };
        if (category && typeof category === 'string' && category !== 'All') {
            query.eventType = category;
        }
        if (search && typeof search === 'string' && search.trim() !== '') {
            query.title = { $regex: search.trim(), $options: 'i' };
        }
        const events = await eventsCollection
            .find(query)
            .sort({ eventDate: 1 })
            .toArray();
        res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
        res.status(200).json({
            success: true,
            data: events,
        });
    }
    catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming events',
        });
    }
};
exports.getUpcomingEvents = getUpcomingEvents;
/**
 * 3. GET /api/events/:id
 * Returns single event details
 */
const getEventById = async (req, res) => {
    try {
        const id = extractParamId(req.params.id);
        if (!id || !mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid Event ID format' });
            return;
        }
        const eventsCollection = (0, db_1.getEventsCollection)();
        const event = await eventsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
        res.status(200).json({
            success: true,
            data: event,
        });
    }
    catch (error) {
        console.error('Error fetching event by id:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event details',
        });
    }
};
exports.getEventById = getEventById;
/**
 * 4. POST /api/events
 * Creates a new event. Strictly validates future date and creator email.
 */
const createEvent = async (req, res) => {
    try {
        const { title, description, eventType, thumbnailUrl, location, eventDate } = req.body;
        const userEmail = req.user?.email;
        const userName = req.user?.name;
        if (!userEmail) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        if (!title || !description || !eventType || !thumbnailUrl || !location || !eventDate) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        // Date validation: Must not be in the past
        const today = new Date().toISOString().split('T')[0];
        const selectedDate = new Date(eventDate).toISOString().split('T')[0];
        if (selectedDate < today) {
            res.status(400).json({
                success: false,
                message: 'Invalid date: Event date must be in the future',
            });
            return;
        }
        const newEvent = {
            title: title.trim(),
            description: description.trim(),
            eventType,
            thumbnailUrl: thumbnailUrl.trim(),
            location: location.trim(),
            eventDate: selectedDate,
            creatorEmail: userEmail,
            creatorName: userName,
            createdAt: new Date().toISOString(),
        };
        const eventsCollection = (0, db_1.getEventsCollection)();
        const result = await eventsCollection.insertOne(newEvent);
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            insertedId: result.insertedId,
        });
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
        });
    }
};
exports.createEvent = createEvent;
/**
 * 5. GET /api/events/my-events
 * Returns events created by the logged-in user
 */
const getMyEvents = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        const eventsCollection = (0, db_1.getEventsCollection)();
        const myEvents = await eventsCollection
            .find({ creatorEmail: userEmail })
            .sort({ createdAt: -1 })
            .toArray();
        res.status(200).json({
            success: true,
            data: myEvents,
        });
    }
    catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your events',
        });
    }
};
exports.getMyEvents = getMyEvents;
/**
 * 6. PUT /api/events/:id
 * Updates an event. Only creator can update.
 */
const updateEvent = async (req, res) => {
    try {
        const id = extractParamId(req.params.id);
        const userEmail = req.user?.email;
        if (!id || !mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid Event ID format' });
            return;
        }
        const eventsCollection = (0, db_1.getEventsCollection)();
        const existingEvent = await eventsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!existingEvent) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        if (existingEvent.creatorEmail !== userEmail) {
            res.status(403).json({
                success: false,
                message: 'Forbidden: You can only update events you created',
            });
            return;
        }
        const { title, description, eventType, thumbnailUrl, location, eventDate } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const selectedDate = eventDate ? new Date(eventDate).toISOString().split('T')[0] : existingEvent.eventDate;
        if (selectedDate < today) {
            res.status(400).json({
                success: false,
                message: 'Invalid date: Event date must be in the future',
            });
            return;
        }
        const updateDoc = {
            $set: {
                title: title ? title.trim() : existingEvent.title,
                description: description ? description.trim() : existingEvent.description,
                eventType: eventType || existingEvent.eventType,
                thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : existingEvent.thumbnailUrl,
                location: location ? location.trim() : existingEvent.location,
                eventDate: selectedDate,
                updatedAt: new Date().toISOString(),
            },
        };
        await eventsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, updateDoc);
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
        });
    }
};
exports.updateEvent = updateEvent;
/**
 * 7. DELETE /api/events/:id
 * Deletes an event. Only creator can delete.
 */
const deleteEvent = async (req, res) => {
    try {
        const id = extractParamId(req.params.id);
        const userEmail = req.user?.email;
        if (!id || !mongodb_1.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid Event ID format' });
            return;
        }
        const eventsCollection = (0, db_1.getEventsCollection)();
        const existingEvent = await eventsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!existingEvent) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        if (existingEvent.creatorEmail !== userEmail) {
            res.status(403).json({
                success: false,
                message: 'Forbidden: You can only delete events you created',
            });
            return;
        }
        await eventsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        // Also clean up any join records for this event
        const joinedCollection = (0, db_1.getJoinedEventsCollection)();
        await joinedCollection.deleteMany({ eventId: id });
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
        });
    }
};
exports.deleteEvent = deleteEvent;
/**
 * 8. POST /api/events/join
 * Joins an event. Stored in joined_events collection.
 */
const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userEmail = req.user?.email;
        const userName = req.user?.name || 'Community Volunteer';
        if (!userEmail) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        if (!eventId || typeof eventId !== 'string' || !mongodb_1.ObjectId.isValid(eventId)) {
            res.status(400).json({ success: false, message: 'Valid Event ID is required' });
            return;
        }
        const eventsCollection = (0, db_1.getEventsCollection)();
        const event = await eventsCollection.findOne({ _id: new mongodb_1.ObjectId(eventId) });
        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        const joinedCollection = (0, db_1.getJoinedEventsCollection)();
        // Check if user has already joined this event
        const alreadyJoined = await joinedCollection.findOne({
            eventId,
            userEmail,
        });
        if (alreadyJoined) {
            res.status(400).json({
                success: false,
                message: 'You have already joined this event',
            });
            return;
        }
        const newJoinedEvent = {
            eventId,
            userEmail,
            userName,
            joinedAt: new Date().toISOString(),
            eventTitle: event.title,
            eventType: event.eventType,
            eventLocation: event.location,
            eventDate: event.eventDate,
            thumbnailUrl: event.thumbnailUrl,
        };
        await joinedCollection.insertOne(newJoinedEvent);
        res.status(201).json({
            success: true,
            message: 'Successfully joined the event!',
        });
    }
    catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to join event',
        });
    }
};
exports.joinEvent = joinEvent;
/**
 * 9. GET /api/events/joined-by-me
 * Returns all events joined by the logged-in user sorted by event date.
 */
const getMyJoinedEvents = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            res.status(401).json({ success: false, message: 'User not authenticated' });
            return;
        }
        const joinedCollection = (0, db_1.getJoinedEventsCollection)();
        const joinedEvents = await joinedCollection
            .find({ userEmail })
            .sort({ eventDate: 1 })
            .toArray();
        res.status(200).json({
            success: true,
            data: joinedEvents,
        });
    }
    catch (error) {
        console.error('Error fetching joined events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch joined events',
        });
    }
};
exports.getMyJoinedEvents = getMyJoinedEvents;
