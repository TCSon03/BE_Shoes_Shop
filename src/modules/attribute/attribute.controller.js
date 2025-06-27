import slugify from "slugify";
import handleAsync from "../../common/utils/handleAsync.js";
import Attribute from "./attribute.model.js";
import createError from "../../common/utils/error.js";
import createReponse from "../../common/utils/reponse.js";
import mongoose from "mongoose";

export const createAttribute = handleAsync(async (req, res, next) => {
  const { name, slugAttri } = req.data;

  const slug = slugAttri || slugify(name, { lower: true, strict: true });

  const existingAttr = await Attribute.findOne({
    $or: [{ name }, { slugAttri: slug }],
  });

  if (existingAttr) {
    if (existingAttr.name === name) {
      return next(createError(400, "Tên thuộc tính đã tồn tại"));
    }
    if (existingAttr.slugAttri === slug) {
      return next(createError(400, "Slug thuộc tính đã tồn tại"));
    }
  }

  const attrData = {
    name,
    slugAttri: slug,
  };

  const newAttribute = await Attribute.create(attrData);

  if (!newAttribute) {
    return next(createError(500, "Tạo thuộc tính thất bại"));
  }

  return res.json(
    createReponse(true, 201, "Thuộc tính được tạo thành công", newAttribute)
  );
});


export const getAllAttributeByAdmin = handleAsync(async (req, res, next) => {
  const data = await Attribute.find();
  if (!data || data.leght === 0) {
    return next(createError(404, "Không tìm thấy thuộc tình nào"));
  }
  return res.json(
    createReponse(true, 200, "Đã lấy được thuộc tính thành công", data)
  );
});

export const getDetailAttribute = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await Attribute.findById(id);
  if (!data) {
    return next(createError(404, "Thuộc tính không tồn tại"));
  }
  return res.json(
    createReponse(true, 200, "Lấy chi tiết thuộc tính thành công", data)
  );
});

export const updateAttribute = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, slugAttri } = req.data;

  const slug = slugAttri || slugify(name, { lower: true, strict: true });

  const attribute = await Attribute.findById(id);
  if (!attribute) {
    return next(createError(404, "Thuộc tính không tồn tại"));
  }

  // Kiểm tra trùng lặp name hoặc slug, ngoại trừ thuộc tính hiện tại
  const existingAttri = await Attribute.findOne({
    $or: [{ name }, { slugAttri: slug }],
    _id: { $ne: id }, //loại trừ thuộc tính hiện tại
  });

  if (existingAttri) {
    if (existingAttri.name === name) {
      return next(createError(400, "Tiêu đề thuộc tính đã tồn tại"));
    }
    if (existingAttri.slugAttri === slug) {
      return next(createError(400, "Slug thuộc tính đã tồn tại"));
    }
  }

  // Dữ liệu cập nhật: kết hợp name, slugAttri và các trường khác
  const attributeData = {
    name,
    slugAttri: slug,
  };

  // Cập nhật thuộc tính
  const updatedAttri = await Attribute.findByIdAndUpdate(id, attributeData, {
    new: true, // Trả về tài liệu đã cập nhật
  });

  if (!updatedAttri) {
    return next(createError(500, "Cập nhật thuộc tính thất bại"));
  }

  return res.json(
    createReponse(
      true,
      200,
      "Thuộc tính được cập nhật thành công",
      updatedAttri
    )
  );
});

export const deleteAttribute = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }
  const data = await Attribute.findByIdAndDelete(id);
  if (!data) {
    return next(createError(404, "thuộc tính không tồn tại"));
  }
  return res.json(createReponse(true, 200, "Xóa thuộc tính thành công"));
});

