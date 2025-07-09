import { Router } from "express";
import validation from "./../../common/middlewares/validatie.middleware.js";
import {
  createBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "./brand.controller.js";
import { createValidation, updateValidation } from "./brand.validation.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/authorization.middleware.js";

const brandRouter = Router();

brandRouter.get("/", getAllBrand);
brandRouter.get("/:id", getBrandById);

brandRouter.post(
  "/create-brand",
  authenticateToken,
  authorizeRoles("admin","superAdmin"),
  validation(createValidation),
  createBrand
);
brandRouter.post(
  "/update-brand/:id",
  validation(updateValidation),
  updateBrand
);

export default brandRouter;
