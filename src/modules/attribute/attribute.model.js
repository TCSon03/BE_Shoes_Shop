import mongoose, { Schema } from "mongoose";

const attributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // không cho trùng tên, ví dụ: 'Color'
    },
    slugAttri: {
      type: String,
      required: true,
      unique: true, // ví dụ: 'color'
    },
  },
  {
    versionKey: false,
    timestamps: true, // tự động tạo createdAt và updatedAt
  }
);

export default mongoose.model("Attribute", attributeSchema);
