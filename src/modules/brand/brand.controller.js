import slugify from "slugify";
import createError from "../../common/utils/error.js";
import createReponse from "../../common/utils/reponse.js";
import Brand from "./brand.model.js";
import handleAsync from "../../common/utils/handleAsync.js";
import mongoose from "mongoose";

export const createBrand = handleAsync(async (req, res, next) => {
  const { title, logoBrand, slugBrand, descriptionBrand } = req.data;

  const slug = slugBrand || slugify(title, { lower: true, strict: true });

  const existingBrand = await Brand.findOne({
    $or: [{ title }, { slugBrand: slug }],
  });

  if (existingBrand) {
    if (existingBrand.title === title) {
      return next(createError(400, "Tiêu đề thương hiệu đã tồn tại"));
    }
    if (existingBrand.slugBrand === slug) {
      return next(createError(400, "Slug thương hiệu đã tồn tại"));
    }
  }

  const brandData = {
    title,
    logoBrand,
    descriptionBrand,
    slugBrand: slug,
  };

  const newBrand = await Brand.create(brandData);
  console.log(newBrand);

  if (!newBrand) {
    return next(createError(500, "Tạo thương hiệu thất bại"));
  }
  return res.json(
    createReponse(true, 201, "thương hiệu được tạo thành công", newBrand)
  );
});

export const getAllBrandByClient = handleAsync(async (req, res, next) => {
  const brand = await Brand.find({ deletedAt: null });
  if (!brand || brand.length === 0) {
    return next(createError(404, "Không tìm thấy brand nào"));
  }
  return res.json(
    createReponse(true, 200, "Đã lấy được brand thành công", brand)
  );
});

export const getAllBrandByAdmin = handleAsync(async (req, res, next) => {
  const brand = await Brand.find();
  if (!brand || brand.length === 0) {
    return next(createError(404, "Không tìm thấy brand nào"));
  }
  return res.json(
    createReponse(true, 200, "Đã lấy được brand thành công", brand)
  );
});

export const getDetailBrand = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await Brand.findById(id);
  if (!data) {
    return next(createError(404, "thương hiệu không tồn tại"));
  }
  return res.json(
    createReponse(true, 200, "Lấy chi tiết thương hiệu thành công", data)
  );
});

export const updateBrand = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, slugBrand, ...otherFields } = req.data;

  const slug = slugBrand || slugify(title, { lower: true, strict: true });

  const brand = await Brand.findById(id);
  if (!brand) {
    return next(createError(404, "Danh mục không tồn tại"));
  }

  // Kiểm tra trùng lặp title hoặc slug, ngoại trừ danh mục hiện tại
  const existingBrand = await Brand.findOne({
    $or: [{ title }, { slugBrand: slug }],
    _id: { $ne: id }, //loại trừ danh mục hiện tại
  });

  if (existingBrand) {
    if (existingBrand.title === title) {
      return next(createError(400, "Tiêu đề danh mục đã tồn tại"));
    }
    if (existingBrand.slugBrand === slug) {
      return next(createError(400, "Slug danh mục đã tồn tại"));
    }
  }

  // Dữ liệu cập nhật: kết hợp title, slugBrand và các trường khác
  const brandData = {
    title,
    slugBrand: slug,
    ...otherFields, // Bao gồm tất cả các trường khác từ req.data
  };

  // Cập nhật danh mục
  const updatedBrand = await Brand.findByIdAndUpdate(id, brandData, {
    new: true, // Trả về tài liệu đã cập nhật
  });

  if (!updatedBrand) {
    return next(createError(500, "Cập nhật danh mục thất bại"));
  }

  return res.json(
    createReponse(
      true,
      200,
      "Danh mục được cập nhật thành công",
      updatedBrand
    )
  );
});

export const deleteBrand = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Brand.findByIdAndDelete(id);
  if (!data) {
    return next(createError(404, "thương hiệu không tồn tại"));
  }
  return res.json(createReponse(true, 200, "Xóa thương hiệu thành công"));
});

export const sortDeleteBrand = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Brand.findByIdAndUpdate(id, {
    deletedAt: new Date(),
    isActive: false,
  });
  if (!data) {
    return next(createError(404, "Ẩn thương hiệu không thành công"));
  }
  return res.json(createReponse(true, 200, "Ẩn thương hiệu thành công"));
});

export const restoreBrand = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Brand.findByIdAndUpdate(id, {
    deletedAt: null,
    isActive: true,
  });
  if (!data) {
    return next(createError(404, "Khôi phục thương hiệu không thành công"));
  }
  return res.json(createReponse(true, 200, "Khôi phục thương hiệu thành công"));
});
