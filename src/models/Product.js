import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // bắt buộc phải có tên sản phẩm
    },
    price: {
      type: Number,
      required: true, // bắt buộc phải có giá sản phẩm
    },
    description: {
      type: String,
      required: true, // bắt buộc phải có mô tả sản phẩm
    },
    stock: {
      type: Number,
      default: 0, // mặc định là 0 nếu không có thông tin về kho hàng
    },
  },
  {
    versionKey: false, // không sử dụng __v
    timestamps: true, // tự động thêm createdAt và updatedAt
  }
);

export default mongoose.model("Product", productSchema);
