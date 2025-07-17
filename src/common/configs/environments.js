import dotenv from "dotenv";

// Load biến môi trường từ .env
dotenv.config();

export const {
  MONGODB_URI,
  PORT,
} = process.env;
