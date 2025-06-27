import slugify from "slugify";
import handleAsync from "../../common/utils/handleAsync.js";
import Product from "./product.model.js";
import createError from "../../common/utils/error.js";
import createReponse from "../../common/utils/reponse.js";
import mongoose from "mongoose";

export const createProduct = handleAsync(async (req, res, next) => {
  const {
    title,
    slugPro,
    shortDescription,
    description,
    thumbnail,
    brandId,
    subCategoryId,
  } = req.data;

  const slug =
    slugPro ||
    slugify(title, {
      lower: true,
      strict: true,
    });

  const existingProduct = await Product.findOne({
    $or: [{ title }, { slugPro: slug }],
  });
  if (existingProduct) {
    if (existingProduct.title === title) {
      return next(createError(400, "Tiêu đề sản phẩm đã tồn tại"));
    }
    if (existingProduct.slugPro === slug) {
      return next(createError(400, "Slug sản phẩm đã tồn tại"));
    }
  }
  const productData = {
    title,
    slugPro: slug,
    shortDescription,
    description,
    thumbnail,
    brandId,
    subCategoryId,
  };
  const newProduct = await Product.create(productData);
  if (!newProduct) {
    return next(createError(500, "Tạo sản phẩm thất bại"));
  }
  return res.json(
    createReponse(true, 201, "Sản phẩm được tạo thành công", newProduct)
  );
});

export const getAllProductByAdmin = handleAsync(async (req, res, next) => {
  const data = await Product.find();
  if (!data || data.length === 0) {
    return next(createError(404, "Không có sản phẩm nào"));
  }
  return res.json(
    createReponse(true, 200, "Lấy tất cả sản phẩm thành công", data)
  );
});

export const getAllProductByClient = handleAsync(async (req, res, next) => {
  const data = await Product.find({ deletedAt: null });
  if (!data || data.length === 0) {
    return next(createError(404, "Không có sản phẩm nào"));
  }
  return res.json(
    createReponse(true, 200, "Lấy tất cả sản phẩm thành công", data)
  );
});

export const getDetailProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await Product.findById(id);
  if (!data) {
    return next(createError(404, "Sản phẩm không tồn tại"));
  }

  return res.json(
    createReponse(true, 200, "Lấy chi tiết sản phẩm thành công", data)
  );
});

export const updateProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    slugPro,
    shortDescription,
    description,
    thumbnail,
    brandId,
    subCategoryId,
  } = req.data;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const slug =
    slugPro ||
    slugify(title, {
      lower: true,
      strict: true,
    });

  const existingProduct = await Product.findOne({
    _id: { $ne: id },
    $or: [{ title }, { slugPro: slug }],
  });
  if (existingProduct) {
    if (existingProduct.title === title) {
      return next(createError(400, "Tiêu đề sản phẩm đã tồn tại"));
    }
    if (existingProduct.slugPro === slug) {
      return next(createError(400, "Slug sản phẩm đã tồn tại"));
    }
  }

  const productData = {
    title,
    slugPro: slug,
    shortDescription,
    description,
    thumbnail,
    brandId,
    subCategoryId,
  };

  const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });
  if (!updatedProduct) {
    return next(createError(500, "Cập nhật sản phẩm thất bại"));
  }
  return res.json(
    createReponse(true, 200, "Cập nhật sản phẩm thành công", updatedProduct)
  );
});

export const deleteProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
  if (!deletedProduct) {
    return next(createError(404, "Sản phẩm không tồn tại"));
  }

  return res.json(
    createReponse(true, 200, "Xóa sản phẩm thành công", deletedProduct)
  );
});

export const sortDeleteProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await Product.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
  if (!data) {
    return next(createError(404, "Sản phẩm không tồn tại"));
  }

  return res.json(
    createReponse(true, 200, "Xóa sản phẩm thành công", data)
  );
});

export const restoreProduct = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await Product.findByIdAndUpdate(
    id,
    { deletedAt: null },
    { new: true }
  );
  if (!data) {
    return next(createError(404, "Khôi phục sản phẩm không thành công"));
  }

  return res.json(
    createReponse(true, 200, "Khôi phục sản phẩm thành công", data)
  );
});

