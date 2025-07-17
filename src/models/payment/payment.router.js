import express from "express";
import { createPaymentUrl, vnpayReturn } from "./payment.controller.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/vnpay/create_payment_url",
  authenticateToken,
  createPaymentUrl
);
paymentRouter.get("/vnpay/vnpay_return", vnpayReturn);

export default paymentRouter;
