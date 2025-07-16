import mongoose from "mongoose";

// Định nghĩa Schema cho một mục trong giỏ hàng (Cart Item)
// Đây sẽ là một sub-document schema, không phải một model riêng biệt
const cartItemSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant", // Tham chiếu đến model Variant
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Số lượng tối thiểu là 1
      default: 1,
    },
    // Bạn có thể thêm các trường khác nếu muốn lưu trữ snapshot của giá, màu, size
    // tại thời điểm thêm vào giỏ hàng để tránh thay đổi giá sau này.
    // Ví dụ:
    // priceAtAddToCart: { type: Number, required: true },
    // colorAtAddToCart: { type: String },
    // sizeAtAddToCart: { type: Number },
  },
  { _id: false } // Không tạo _id cho mỗi cart item sub-document nếu không cần
);

// Định nghĩa Schema cho Giỏ hàng (Cart)
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến model User
      required: true,
      unique: true, // Mỗi người dùng chỉ có một giỏ hàng
    },
    items: [cartItemSchema], // Mảng các mục trong giỏ hàng
    // Bạn có thể thêm các trường khác cho giỏ hàng, ví dụ:
    // totalItems: { type: Number, default: 0 },
    // totalPrice: { type: Number, default: 0 }, // Có thể tính toán ở frontend hoặc backend khi cần
  },
  {
    versionKey: false, // Tắt trường __v
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
