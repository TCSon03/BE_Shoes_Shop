import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtOrder: {
    type: Number,
    required: true,
  },

  productName: { type: String },
  color: { type: String },
  size: { type: Number },
  thumbnail: { type: String },
});

// Định nghĩa Schema cho Đơn hàng (Order)
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema], // Mảng các mục hàng trong đơn hàng
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: { type: String, required: true },
      ward: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending", // Đang chờ xác nhận
        "processing", // Đang xử lý
        "shipped", // Đã giao cho đơn vị vận chuyển
        "delivered", // Đã giao thành công
        "cancelled", // Đã hủy
        "received", // Đã nhận hàng
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"], // Các phương thức thanh toán
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false, // Trạng thái thanh toán
    },
    paidAt: {
      type: Date, // Thời điểm thanh toán
    },
    deliveredAt: {
      type: Date, // Thời điểm giao hàng thành công
    },
    notes: {
      type: String,
      default: "", // Ghi chú của khách hàng
    },
  },
  {
    versionKey: false,
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
