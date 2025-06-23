import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // tên danh mục phải duy nhất
    },
    logoCategory: {
      type: String,
      default: "", // URL ảnh logo
    },
    descriptionCategory: {
      type: String,
      default: "",
    },
    slugCategory: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true, // true: hoạt động
    },
    position: {
      type: Number,
      default: 0, // vị trí sắp xếp
    },
    deletedAt: {
      type: Date,
      default: null, // để xử lý soft delete
    },
  },
  {
    versionKey: false, // không sử dụng __v
    timestamps: true, // tự động thêm createdAt và updatedAt
  }
);

export default mongoose.model("Category", categorySchema);
