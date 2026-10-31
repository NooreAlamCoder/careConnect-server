import { Request } from 'express';

export type EventType =
  | 'Cleanup'
  | 'Plantation'
  | 'Donation'
  | 'Education'
  | 'Healthcare'
  | 'Other';

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnailUrl: string;
  location: string;
  eventDate: string; // ISO 8601 string, must be a future date
  creatorEmail: string;
  creatorName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IJoinedEvent {
  _id?: string;
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
  // Snapshot of event details for fast retrieval
  eventTitle: string;
  eventType: EventType;
  eventLocation: string;
  eventDate: string;
  thumbnailUrl: string;
}

export interface IAuthPayload {
  email: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IAuthPayload;
}


// Auth session token interfaces

// Standard ApiResponse generic
