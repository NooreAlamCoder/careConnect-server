"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJoinedEventsCollection = exports.getEventsCollection = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'social_development_db';
const client = new mongodb_1.MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 1,
});
let db = null;
let clientPromise = null;
const connectDB = async () => {
    if (db)
        return db;
    if (!clientPromise) {
        clientPromise = client.connect();
    }
    try {
        const connectedClient = await clientPromise;
        db = connectedClient.db(dbName);
        return db;
    }
    catch (error) {
        clientPromise = null;
        console.error('❌ MongoDB Connection Notice: Could not connect to MongoDB URI.');
        throw error;
    }
};
exports.connectDB = connectDB;
const getEventsCollection = () => {
    if (!db) {
        throw new Error('Database is not initialized. Call connectDB first.');
    }
    return db.collection('events');
};
exports.getEventsCollection = getEventsCollection;
const getJoinedEventsCollection = () => {
    if (!db) {
        throw new Error('Database is not initialized. Call connectDB first.');
    }
    return db.collection('joined_events');
};
exports.getJoinedEventsCollection = getJoinedEventsCollection;
