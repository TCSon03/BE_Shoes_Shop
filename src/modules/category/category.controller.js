import handleAsync from "../../common/utils/handleAsync.js";
import createReponse from "./../../common/utils/reponse.js";
import Category from "./category.model.js";
import slugify from "slugify";
import createError from "./../../common/utils/error.js";
import mongoose from "mongoose";

export const createCategory = handleAsync(async (req, res, next) => {
  const { title, logoCategory, slugCate, descriptionCategory } = req.data;

  const slug = slugCate || slugify(title, { lower: true, strict: true });

  const existingCategory = await Category.findOne({
    $or: [{ title }, { slugCate: slug }],
  });

  if (existingCategory) {
    if (existingCategory.title === title) {
      return next(createError(400, "Tiêu đề danh mục đã tồn tại"));
    }
    if (existingCategory.slugCate === slug) {
      return next(createError(400, "Slug danh mục đã tồn tại"));
    }
  }

  const categoryData = {
    title,
    logoCategory,
    descriptionCategory,
    slugCate: slug,
  };

  const newCategory = await Category.create(categoryData);
  console.log(newCategory);

  if (!newCategory) {
    return next(createError(500, "Tạo danh mục thất bại"));
  }
  return res.json(
    createReponse(true, 201, "Danh mục được tạo thành công", newCategory)
  );
});

export const getAllCategoryByClient = handleAsync(async (req, res, next) => {
  const categories = await Category.find({ deletedAt: null });
  if (!categories || categories.length === 0) {
    return next(createError(404, "Không tìm thấy danh mục nào"));
  }
  return res.json(
    createReponse(true, 200, "Đã lấy được danh mục thành công", categories)
  );
});

export const getAllCategoryByAdmin = handleAsync(async (req, res, next) => {
  const dataCateAdmin = await Category.find();
  if (!dataCateAdmin || dataCateAdmin.leght === 0) {
    return next(createError(404, "Không tìm thấy danh mục nào"));
  }
  return res.json(
    createReponse(true, 200, "Đã lấy được danh mục thành công", dataCateAdmin)
  );
});

export const getDetailCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await Category.findById(id);
  if (!data) {
    return next(createError(404, "Danh mục không tồn tại"));
  }
  return res.json(
    createReponse(true, 200, "Lấy chi tiết danh mục thành công", data)
  );
});

export const updateCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, slugCate, ...otherFields } = req.data;

  const slug = slugCate || slugify(title, { lower: true, strict: true });

  const category = await Category.findById(id);
  if (!category) {
    return next(createError(404, "Danh mục không tồn tại"));
  }

  // Kiểm tra trùng lặp title hoặc slug, ngoại trừ danh mục hiện tại
  const existingCategory = await Category.findOne({
    $or: [{ title }, { slugCate: slug }],
    _id: { $ne: id }, //loại trừ danh mục hiện tại
  });

  if (existingCategory) {
    if (existingCategory.title === title) {
      return next(createError(400, "Tiêu đề danh mục đã tồn tại"));
    }
    if (existingCategory.slugCate === slug) {
      return next(createError(400, "Slug danh mục đã tồn tại"));
    }
  }

  // Dữ liệu cập nhật: kết hợp title, slugCate và các trường khác
  const categoryData = {
    title,
    slugCate: slug,
    ...otherFields, // Bao gồm tất cả các trường khác từ req.data
  };

  // Cập nhật danh mục
  const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, {
    new: true, // Trả về tài liệu đã cập nhật
  });

  if (!updatedCategory) {
    return next(createError(500, "Cập nhật danh mục thất bại"));
  }

  return res.json(
    createReponse(
      true,
      200,
      "Danh mục được cập nhật thành công",
      updatedCategory
    )
  );
});

export const deleteCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Category.findByIdAndDelete(id);
  if (!data) {
    return next(createError(404, "Danh mục không tồn tại"));
  }
  return res.json(createReponse(true, 200, "Xóa danh mục thành công"));
});

export const sortDeleteCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Category.findByIdAndUpdate(id, {
    deletetAt: new Date(),
    isActive: false,
  });
  if (!data) {
    return next(createError(404, "Ẩn danh mục không thành công"));
  }
  return res.json(createReponse(true, 200, "Ẩn danh mục thành công"));
});

export const restoreCategory = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Category.findByIdAndUpdate(id, {
    deletetAt: null,
    isActive: true,
  });
  if (!data) {
    return next(createError(404, "Khôi phục danh mục không thành công"));
  }
  return res.json(createReponse(true, 200, "Khôi phục danh mục thành công"));
});
