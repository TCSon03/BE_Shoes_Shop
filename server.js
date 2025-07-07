import express from "express";
import connectDB from "./src/common/configs/db.js";
import router from "./src/router/index.js";
import { PORT } from "./src/common/configs/environments.js";

// Kết nối database
connectDB();

// Khởi tạo app
const app = express();

// Middleware
app.use(express.json());

// Router
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
