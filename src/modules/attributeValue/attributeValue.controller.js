import slugify from "slugify";
import handleAsync from "../../common/utils/handleAsync.js";
import Attribute from "../attribute/attribute.model.js";
import createError from "../../common/utils/error.js";
import AttributeValue from "./attributeValue.model.js";
import createReponse from "../../common/utils/reponse.js";
import mongoose from "mongoose";

export const createAttributeValue = handleAsync(async (req, res, next) => {
  const { value, slugAttriValue, attributeId } = req.data;

  const slug = slugAttriValue || slugify(value, { lower: true, strict: true });

  // Kiểm tra attributeId có tồn tại
  const attr = await Attribute.findById(attributeId);
  if (!attr) return next(createError(404, "Thuộc tính cha không tồn tại"));

  // Kiểm tra trùng lặp value hoặc slug trong cùng một attribute
  const existing = await AttributeValue.findOne({
    attributeId,
    $or: [{ value }, { slugAttriValue: slug }],
  });
  if (existing) {
    if (existing.value === value) {
      return next(createError(400, "Giá trị đã tồn tại"));
    }
    if (existing.slugAttriValue === slug) {
      return next(createError(400, "Slug giá trị đã tồn tại"));
    }
  }

  const attriValue = await AttributeValue.create({
    value,
    slugAttriValue: slug,
    attributeId,
  });

  if (!attriValue) return next(createError(500, "Tạo giá trị thất bại"));

  return res.json(
    createReponse(true, 201, "Tạo giá trị thuộc tính thành công", attriValue)
  );
});

export const getAllAttributeValueByAdmin = handleAsync(
  async (req, res, next) => {
    const data = await AttributeValue.find();
    if (!data || data.length === 0) {
      return next(createError(404, "Không có giá trị nào"));
    }

    return res.json(
      createReponse(true, 200, "Lấy tất cả giá trị thành công", data)
    );
  }
);

export const getDetailAttributeValue = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const data = await AttributeValue.findById(id);
  if (!data) {
    return next(createError(404, "Giá trị không tồn tại"));
  }

  return res.json(
    createReponse(true, 200, "Lấy chi tiết giá trị thành công", data)
  );
});

export const updateAttributeValue = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const { value, slugAttriValue, attributeId } = req.data;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const slug = slugAttriValue || slugify(value, { lower: true, strict: true });

  const attr = await Attribute.findById(attributeId);
  if (!attr) return next(createError(404, "Thuộc tính cha không tồn tại"));

  const existing = await AttributeValue.findOne({
    attributeId,
    $or: [{ value }, { slugAttriValue: slug }],
    _id: { $ne: id },
  });
  if (existing) {
    if (existing.value === value) {
      return next(createError(400, "Giá trị đã tồn tại"));
    }
    if (existing.slugAttriValue === slug) {
      return next(createError(400, "Slug đã tồn tại"));
    }
  }

  const updated = await AttributeValue.findByIdAndUpdate(
    id,
    { value, slugAttriValue: slug, attributeId },
    { new: true }
  );

  if (!updated) return next(createError(500, "Cập nhật thất bại"));

  return res.json(
    createReponse(true, 200, "Cập nhật giá trị thành công", updated)
  );
});

export const deleteAttributeValue = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Id không hợp lệ"));
  }

  const deleted = await AttributeValue.findByIdAndDelete(id);
  if (!deleted) {
    return next(createError(404, "Giá trị không tồn tại"));
  }

  return res.json(
    createReponse(true, 200, "Xóa giá trị thuộc tính thành công")
  );
});
