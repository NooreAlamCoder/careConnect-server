import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { IEvent, IJoinedEvent } from '../types';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'social_development_db';

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

let db: Db | null = null;

export const connectDB = async (): Promise<Db> => {
  if (db) return db;

  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ MongoDB Connected successfully to database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB Connection Notice: Could not connect to MongoDB URI. Please set your MongoDB connection string in server/.env');
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

