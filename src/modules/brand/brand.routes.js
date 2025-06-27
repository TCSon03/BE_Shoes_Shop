import { Router } from "express";
import { brandValidation } from "./brand.validation.js";
import {
  createBrand,
  deleteBrand,
  getAllBrandByAdmin,
  getAllBrandByClient,
  getDetailBrand,
  restoreBrand,
  sortDeleteBrand,
  updateBrand,
} from "./brand.controller.js";
import validBodyRequest from "../../common/middlewares/validBodyRequest.js";

const categoryRoutes = Router();

categoryRoutes.get("/get-client", getAllBrandByClient);
categoryRoutes.get("/get-admin", getAllBrandByAdmin);

categoryRoutes.get("/:id", getDetailBrand);
categoryRoutes.delete("/:id", deleteBrand);
categoryRoutes.delete("/sort-delete/:id", sortDeleteBrand);
categoryRoutes.patch("/restore/:id", restoreBrand);

categoryRoutes.post("/", validBodyRequest(brandValidation), createBrand);
categoryRoutes.patch("/:id", validBodyRequest(brandValidation), updateBrand);

export default categoryRoutes;
