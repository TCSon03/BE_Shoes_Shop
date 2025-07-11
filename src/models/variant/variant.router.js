import { Router } from "express";
import {
  createVariant,
  deleteVariant,
  getAllVariant,
  getVariantById,
  updateVariant,
} from "./variant.controller.js";
import validation from "./../../common/middlewares/validatie.middleware.js";
import variantValidation from "./variant.validation.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/authorization.middleware.js";

const variantRouter = Router();

variantRouter.get("/:productId/variants", getAllVariant);
variantRouter.get("/variants/:id", getVariantById);
variantRouter.delete(
  "/variant/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  deleteVariant
);

variantRouter.post(
  "/:productId/create-var",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(variantValidation),
  createVariant
);
variantRouter.put(
  "/variants/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"), 
  validation(variantValidation),
  updateVariant
);

export default variantRouter;
