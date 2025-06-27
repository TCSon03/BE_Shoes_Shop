import slugify from "slugify";
import handleAsync from "./../../common/utils/handleAsync.js";
import SubCategory from "./subCategory.model.js";
import createError from "../../common/utils/error.js";
import createReponse from "../../common/utils/reponse.js";
import Category from "../category/category.model.js";
import mongoose from "mongoose";

export const createSubCate = handleAsync(async (req, res, next) => {
  const {
    title,
    logoCategory = "",
    descriptionCate = "",
    slugSubCate,
    isActive = true,
    position = 0,
    categoryId,
  } = req.data;

  // Kiểm tra categoryId hợp lệ
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return next(createError(400, "Category ID không hợp lệ"));
  }

  // Kiểm tra danh mục cha tồn tại
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(createError(404, "Danh mục cha không tồn tại"));
  }

  const slug = slugSubCate || slugify(title, { lower: true, strict: true });

  const existing = await SubCategory.findOne({ slugSubCate: slug });
  if (existing) {
    return next(createError(404, "Slug SubCategory đã tồn tại"));
  }

  const newSubCategory = await SubCategory.create({
    title,
    logoCategory,
    descriptionCate,
    slugSubCate: slug,
    isActive,
    position,
    categoryId,
  });

  if (!newSubCategory) {
    return next(createError(500, "Tạo SubCategory thất bại"));
  }
  return res.json(
    createReponse(true, 201, "Tạo SubCategory thành công", newSubCategory)
  );
});

export const getAllSubCategoryByClient = handleAsync(async (req, res, next) => {
  const subCategory = await SubCategory.find({ deletedAt: null });
  if (!subCategory || subCategory.length === 0) {
    return next(createError(404, "Không tìm thấy dsubCategory nào"));
  }
  return res.json(
    createReponse(true, 200, "Đã lấy được subCategory thành công", subCategory)
  );
});

export const getAllSubCategoryByAdmin = handleAsync(async (req, res, next) => {
  const dataSubCateAdmin = await SubCategory.find();
  if (!dataSubCateAdmin || dataSubCateAdmin.leght === 0) {
    return next(createError(404, "Không tìm thấy danh mục nào"));
  }
  return res.json(
    createReponse(
      true,
      200,
      "Đã lấy được danh mục thành công",
      dataSubCateAdmin
    )
  );
});

export const getDetailSubCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await SubCategory.findById(id);
  if (!data) {
    return next(createError(404, "Danh mục không tồn tại"));
  }
  return res.json(
    createReponse(true, 200, "Lấy chi tiết danh mục thành công", data)
  );
});

export const deleteSubCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await SubCategory.findByIdAndDelete(id);
  if (!data) {
    return next(createError(404, "Danh mục không tồn tại"));
  }
  return res.json(createReponse(true, 200, "Xóa danh mục thành công"));
});

export const sortDeleteSubCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await SubCategory.findByIdAndUpdate(id, {
    deletetAt: new Date(),
    isActive: false,
  });
  if (!data) {
    return next(createError(404, "Ẩn danh mục không thành công"));
  }
  return res.json(createReponse(true, 200, "Ẩn danh mục thành công"));
});

export const restoreSubCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await SubCategory.findByIdAndUpdate(id, {
    deletetAt: null,
    isActive: true,
  });
  if (!data) {
    return next(createError(404, "Khôi phục danh mục không thành công"));
  }
  return res.json(createReponse(true, 200, "Khôi phục danh mục thành công"));
});
