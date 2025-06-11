import mongoose from "mongoose";
import { DB_URI } from "./enviroments.js";

function connectDB() {
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

export default connectDB;
