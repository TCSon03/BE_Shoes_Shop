import express from "express";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import {
  createOrder,
  getAllOrdersForAdmin,
  getOrderDetail,
  getUserOrders,
  updateOrderStatus,
} from "./order.controller.js";
import validation from "../../common/middlewares/validatie.middleware.js";
import { orderJoiSchema } from "./order.validation.js";
import { authorizeRoles } from "./../../common/middlewares/authorization.middleware.js";

const orderRouter = express.Router();

orderRouter.post(
  "/create",
  authenticateToken,
  validation(orderJoiSchema),
  createOrder
);
orderRouter.get("/all", authenticateToken, getUserOrders);
orderRouter.get(
  "/all-admin",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  getAllOrdersForAdmin
);

orderRouter.put(
  "/:orderId/status",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  updateOrderStatus
);

orderRouter.get(
  "/:orderId",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  getOrderDetail
);
export default orderRouter;
