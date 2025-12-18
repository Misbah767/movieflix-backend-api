import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function connectDB() {
  const dbName = process.env.MONGODB_NAME;
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL not set");
  if (!dbName) throw new Error("MONGODB_NAME not set");

  try {
    await mongoose.connect(process.env.MONGODB_URL, { dbName });
    console.log(`MongoDB connected! Database: ${dbName}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
