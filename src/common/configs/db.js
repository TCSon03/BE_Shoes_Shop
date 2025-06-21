import mongoose from "mongoose";
import { DB_URI } from "./enviroments.js";

function connectDB() {
  return mongoose.connect(DB_URI); // return Promise
}

export default connectDB;
