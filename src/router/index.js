import { Router } from "express";
import authRouter from "../models/auth/auth.router.js";
import brandRouter from "../models/brand/brand.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/brand", brandRouter);

export default router;
