import express from "express";
import router from "./src/routers/index.js";
import connectDB from "./src/common/configs/db.js";
import { PORT,HOST } from "./src/common/configs/enviroments.js";
import setupSwagger from "./src/common/configs/swagger-config.js";

connectDB();

const app = express();

app.use(express.json());

app.use("/api", router);

setupSwagger(app);

app.listen(PORT, HOST, () => {
	console.log(`Server is running on: http://${HOST}:${PORT}/api`);
	console.log(`Swagger Docs available at http://${HOST}:${PORT}/api-docs`);
});
