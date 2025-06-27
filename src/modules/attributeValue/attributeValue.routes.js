import validBodyRequest from "../../common/middlewares/validBodyRequest.js";
import {
  createAttributeValue,
  deleteAttributeValue,
  getAllAttributeValueByAdmin,
  getDetailAttributeValue,
  updateAttributeValue,
} from "./attributeValue.controller.js";
import { attributeValueSchema } from "./attributeValue.validation.js";

const attributeValueRoutes = Router();

attributeValueRoutes.get("/", getAllAttributeValueByAdmin);
attributeValueRoutes.get("/:id", getDetailAttributeValue);
attributeValueRoutes.delete("/:id", deleteAttributeValue);

attributeValueRoutes.post(
  "/",
  validBodyRequest(attributeValueSchema),
  createAttributeValue
);
attributeValueRoutes.put(
  "/:id",
  validBodyRequest(attributeValueSchema),
  updateAttributeValue
);

export default attributeValueRoutes;
