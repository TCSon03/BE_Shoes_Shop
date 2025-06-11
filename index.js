import express from "express";
import router from "./src/routers/index.js";
import connectDB from "./src/configs/db.js";
import { PORT } from "./src/configs/enviroments.js";

connectDB();

const app = express();

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
