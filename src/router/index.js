import { Router } from "express";
import authRouter from "../models/auth/auth.router.js";
import brandRouter from "../models/brand/brand.router.js";
import categoryRouter from "../models/category/category.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);
router.use("/cate", categoryRouter);

export default router;
