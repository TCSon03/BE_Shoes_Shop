import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/common/configs/db.js";
import router from "./src/router/index.js";

// Load biến môi trường từ .env
dotenv.config();

// Kết nối database
connectDB();

// Khởi tạo app
const app = express();

// Middleware
app.use(express.json());

// Router
app.use("/api", router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
