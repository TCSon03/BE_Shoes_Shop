import { Router } from "express";
import validBodyRequest from "../../common/middlewares/validBodyRequest.js";
import { subCategoryValidation } from "./subCategory.validation.js";
import {
  createSubCate,
  deleteSubCategory,
  getAllSubCategoryByAdmin,
  getAllSubCategoryByClient,
  getDetailSubCategory,
  restoreSubCategory,
  sortDeleteSubCategory,
} from "./subCategory.controller.js";

const subCategoryRoutes = Router();

subCategoryRoutes.get("/get-client", getAllSubCategoryByClient);
subCategoryRoutes.get("/get-admin", getAllSubCategoryByAdmin);
subCategoryRoutes.get("/:id", getDetailSubCategory);
subCategoryRoutes.delete("/:id", deleteSubCategory);
subCategoryRoutes.delete("/sort-delete/:id", sortDeleteSubCategory);
subCategoryRoutes.patch("/restore/:id", restoreSubCategory);

subCategoryRoutes.post(
  "/",
  validBodyRequest(subCategoryValidation),
  createSubCate
);

export default subCategoryRoutes;
