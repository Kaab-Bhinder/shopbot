import mongoose from 'mongoose';

// Import all models to ensure they are registered
import '../models/categoryModel';
import '../models/subcategoryModel';
import '../models/productModel';
import '../models/userModel';
import '../models/reviewModel';
import '../models/cartModel';
import '../models/wishlistModel';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Ensure we're connecting to the TRYON database
const dbName = process.env.MONGODB_DB || 'SHOPBOT';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connect() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('Attempting to connect to MongoDB...');
    console.log(`Database: ${dbName}`);
    cached.promise = mongoose.connect(MONGODB_URI, { ...opts, dbName }).then((mongoose) => {
      console.log(`MongoDB connected successfully to database: ${dbName}`);
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection failed:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default connect;
