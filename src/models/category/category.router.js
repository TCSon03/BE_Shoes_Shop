import { Router } from "express";
import validation from "../../common/middlewares/validatie.middleware.js";
import { authenticateToken } from "../../common/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../common/middlewares/authorization.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  getSoftCategories,
  restoreCategory,
  sortDeleteCategory,
  updateCategory,
} from "./category.controller.js";
import {
  createCateValidation,
  updateCateValidation,
} from "./category.validation.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.get(
  "/get-soft",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  getSoftCategories
);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.delete(
  "/delete-cate/:id",
  authenticateToken,
  authorizeRoles("superAdmin"),
  deleteCategory
);

categoryRouter.post(
  "/create-cate",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(createCateValidation),
  createCategory
);
categoryRouter.put(
  "/update-cate/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  validation(updateCateValidation),
  updateCategory
);
categoryRouter.put(
  "/restore-cate/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  restoreCategory
);
categoryRouter.delete(
  "/sort-cate/:id",
  authenticateToken,
  authorizeRoles("admin", "superAdmin"),
  sortDeleteCategory
);

export default categoryRouter;
