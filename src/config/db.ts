import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { IEvent, IJoinedEvent } from '../types';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'social_development_db';

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 1,
});

let db: Db | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export const connectDB = async (): Promise<Db> => {
  if (db) return db;

  if (!clientPromise) {
    clientPromise = client.connect();
  }

  try {
    const connectedClient = await clientPromise;
    db = connectedClient.db(dbName);
    return db;
  } catch (error) {
    clientPromise = null;
    console.error('❌ MongoDB Connection Notice: Could not connect to MongoDB URI.');
    throw error;
  }
};

export const getEventsCollection = (): Collection<IEvent> => {
  if (!db) {
    throw new Error('Database is not initialized. Call connectDB first.');
  }
  return db.collection<IEvent>('events');
};

export const getJoinedEventsCollection = (): Collection<IJoinedEvent> => {
  if (!db) {
    throw new Error('Database is not initialized. Call connectDB first.');
  }
  return db.collection<IJoinedEvent>('joined_events');
};
