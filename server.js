import express from "express";
import connectDB from "./src/common/configs/db.js";
import router from "./src/router/index.js";
import { PORT } from "./src/common/configs/environments.js";
import cors from "cors";

// Kết nối database
connectDB();

// Khởi tạo app
const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], // Nên thêm các phương thức HTTP bạn sử dụng
    allowedHeaders: ["Content-Type", "Authorization"], // Nên thêm các header bạn sử dụng
  })
);

// Router
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
