import { Router } from "express";
import validation from "./../../common/middlewares/validatie.middleware.js";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  getSoftDeletedBrand,
  restoreBrand,
  sortDeleteBrand,
  updateBrand,
} from "./brand.controller.js";
import { createValidation, updateValidation } from "./brand.validation.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/authorization.middleware.js";

const brandRouter = Router();

brandRouter.get("/", getAllBrand);
brandRouter.get(
  "/get-soft",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  getSoftDeletedBrand
);
brandRouter.get("/:id", getBrandById);
brandRouter.delete(
  "/delete-brand/:id",
  authenticateToken,
  authorizeRoles("superAdmin"),
  deleteBrand
);

brandRouter.post(
  "/create-brand",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(createValidation),
  createBrand
);
brandRouter.put(
  "/update-brand/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(updateValidation),
  updateBrand
);
brandRouter.put(
  "/restore-brand/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  restoreBrand
);
brandRouter.delete(
  "/sort-brand/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  sortDeleteBrand
);

export default brandRouter;
