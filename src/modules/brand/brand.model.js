import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    title: {
      type: String, // Tiêu đề danh mục (ví dụ: Giày, Dép...)
      required: true,
    },
    logoBrand: {
      type: String, // URL hình ảnh logo của danh mục
      default: "",
    },
    descriptionBrand: {
      type: String, // Mô tả thêm cho danh mục
      default: "",
    },
    slugBrand: {
      type: String, // Slug dùng cho URL, duy nhất và không được để trống
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean, // Trạng thái hiển thị (true: còn hoạt động, false: đã ẩn)
      default: true,
    },
    position: {
      type: Number, // Vị trí hiển thị trong danh sách
      default: 0,
    },
    deletedAt: {
      type: Date, // Trường dùng cho xóa mềm (soft delete)
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
