import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String, // Tiêu đề danh mục (ví dụ: Giày, Dép...)
      required: true,
    },
    logoCategory: {
      type: String, // URL hình ảnh logo của danh mục
      default: "",
    },
    descriptionCate: {
      type: String, // Mô tả thêm cho danh mục
      default: "",
    },
    slugCate: {
      type: String, // Slug dùng cho URL, duy nhất và không được để trống
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean, // Trạng thái hiển thị (true: còn hoạt động, false: đã ẩn)
      default: true,
    },
    position: {
      type: String, // Vị trí hiển thị trong danh sách
      default: 0,
    },
    deletetAt: {
      type: Date, // Trường dùng cho xóa mềm (soft delete)
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("Category", categorySchema);
