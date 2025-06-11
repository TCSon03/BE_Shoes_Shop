import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      unique: true, //unique title chỉ có một cái title duy nhất
      required: true, // bắt buộc phải có title
    },
    description: {
      type: String,
      required: true, // bắt buộc phải có description
    },
    slug: {
      type: String,
      unique: true, //unique slug chỉ có một cái slug duy nhất
      required: true, // bắt buộc phải có slug
    },
    deletedAt: {
      type: Date,
      default: null, // mặc định là true
    },
  },
  {
    versionKey: false, // không sử dụng __v
    timestamps: true, // tự động thêm createdAt và updatedAt
  }
);

export default mongoose.model("Category", categorySchema);
