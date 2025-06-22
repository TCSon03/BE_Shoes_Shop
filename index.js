import express from "express";
import router from "./src/routers/index.js";
import connectDB from "./src/common/configs/db.js";
import { PORT, HOST } from "./src/common/configs/enviroments.js";
import setupSwagger from "./src/common/configs/swagger-config.js";
import cors from "cors";

const app = express();

async function startServer() {
  try {
    await connectDB();
    console.log("mongoDB connected successfully");

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    app.use(express.json());
    app.use("/api", router);
    setupSwagger(app);

    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}/api`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
}
startServer();
