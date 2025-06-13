import Product from "./product.model.js";
import handleAsync from './../../common/utils/handleAsync.js';
import { productSchema } from './product.validation.js';

export const getListProduct = handleAsync(async (req, res, next) => {
  const products = await Product.find();
  if (products) {
    console.log("Danh sach san pham:", products);
    return res.json({
      success: true,
      statusCode: 200,
      message: "Danh sach san pham",
      data: products,
    });
  }
  next(createError(false, 404, "Khong co san pham nao"));
});

export const getDetailProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    const product = await Product.findById(id);
    return res.json({
      success: true,
      statusCode: 200,
      message: "Chi tiet san pham",
      data: product,
    });
  }
  next(createError(false, 404, "Khong tim thay san pham"));
});

export const createProduct = handleAsync(async (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return next(createError(false, 400, error.details[0].message));
  }

  const data = await Product.create(req.body);
  if (data) {
    console.log("San pham da duoc tao:", data);
    return res.json({
      success: true,
      statusCode: 201,
      message: "San pham da duoc tao",
      data: data,
    });
  }
  next(createError(false, 400, "Tao san pham that bai"));
});

export const updateProduct = handleAsync(async (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return next(createError(false, 400, error.details[0].message));
  }

  const { id } = req.params;
  if (id) {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body);
    console.log("San pham da duoc cap nhat:", updatedProduct);
    return res.json({
      success: true,
      statusCode: 200,
      message: "San pham da duoc cap nhat",
      data: updatedProduct,
    });
  }
  next(createError(false, 404, "Khong tim thay san pham"));
});

export const deleteProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (id) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log("San pham da duoc xoa:", deletedProduct);
    return res.json({
      success: true,
      statusCode: 200,
      message: "San pham da duoc xoa",
      data: deletedProduct,
    });
  }
  next(createError(false, 404, "Khong tim thay san pham"));
});
