import { Router } from "express";
import {
  createVariant,
  deleteVariant,
  getAllVariant,
  getVariantById,
  updateVariant,
} from "./variant.controller.js";
import validation from "./../../common/middlewares/validatie.middleware.js";
import {
  variantValidation,
  updateVariantValidation,
} from "./variant.validation.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/authorization.middleware.js";

const variantRouter = Router();

variantRouter.get("/get-all-var", getAllVariant);
variantRouter.get("/variants/:id", getVariantById);
variantRouter.delete(
  "/delete-var/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  deleteVariant
);

variantRouter.post(
  "/create-var",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(variantValidation),
  createVariant
);
variantRouter.put(
  "/update-var/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(updateVariantValidation),
  updateVariant
);

export default variantRouter;
