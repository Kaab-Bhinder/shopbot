import mongoose from "mongoose";

export async function connect() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables");
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Attempting to connect to MongoDB...");
    const dbName = process.env.MONGODB_DB || 'SHOPBOT';
    console.log(`Database: ${dbName}`);
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, { ...options, dbName });
    
    const connection = mongoose.connection;
    
    connection.on('connected', () => {
      console.log(`MongoDB connected successfully to database: ${dbName}`);
    });

    connection.on('error', (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

    connection.on('disconnected', () => {
      console.log("MongoDB disconnected");
    });

    process.on('SIGINT', async () => {
      await connection.close();
      process.exit(0);
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err; // Throw the error instead of exiting the process
  }
}