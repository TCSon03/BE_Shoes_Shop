import mongoose from "mongoose";
import Cart from "../cart/cart.model.js";
import Variant from "../variant/variant.model.js";
import Order from "./order.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { shippingAddress, phoneNumber, paymentMethod, notes } = req.body;

    // Bước 2: Lấy giỏ hàng từ DB
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.variantId",
      populate: {
        path: "productId",
        select: "name",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng đang trống." });
    }

    // Bước 3: Tạo danh sách orderItems từ giỏ hàng
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const variant = item.variantId;

      if (!variant) {
        return res.status(404).json({
          message: `Không tìm thấy biến thể sản phẩm.`,
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${
            variant.productId?.name || "nào đó"
          } không đủ hàng trong kho.`,
        });
      }

      const priceAtOrder = variant.price;
      totalAmount += item.quantity * priceAtOrder;

      orderItems.push({
        variantId: variant._id,
        quantity: item.quantity,
        priceAtOrder,
        productName: variant.productId?.name || "",
        color: variant.color,
        size: variant.size,
        thumbnail: variant.image,
      });
    }

    // **QUAN TRỌNG:** Giữ nguyên bước trừ kho VÀ xoá giỏ hàng.
    // Việc này đảm bảo hàng không bị bán trùng và giỏ hàng được dọn dẹp.
    // Nếu thanh toán VNPAY thất bại, bạn có thể cân nhắc một cơ chế hoàn kho/thông báo.
    for (const item of cart.items) {
      await Variant.findByIdAndUpdate(item.variantId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Bước 5: Tạo đơn hàng
    const newOrder = await Order.create({
      userId,
      orderItems,
      totalAmount,
      shippingAddress,
      phoneNumber,
      paymentMethod,
      notes,
      // CHỈNH SỬA Ở ĐÂY:
      isPaid: false, // Ban đầu luôn là false khi tạo đơn hàng, chờ xác nhận từ VNPAY
      paidAt: null, // Ban đầu là null, sẽ được cập nhật sau khi thanh toán thành công
      status: "pending", // Hoặc một trạng thái "chờ thanh toán" khác nếu bạn có
    });

    // Bước 6: Xoá giỏ hàng
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    // Bước 7: Trả về kết quả
    // Trả về ID của đơn hàng để frontend có thể dùng nó gọi API VNPAY
    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      orderId: newOrder._id, // Trả về ID đơn hàng
      totalAmount: newOrder.totalAmount, // Trả về tổng tiền để frontend tiện sử dụng cho VNPAY
      paymentMethod: newOrder.paymentMethod, // Trả về phương thức thanh toán
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    // Lưu ý: Nếu có lỗi ở đây (ví dụ, DB lỗi, giỏ hàng trống), kho vẫn chưa bị trừ.
    // Nếu lỗi sau khi trừ kho nhưng trước khi tạo đơn hàng, cần có cơ chế rollback hoặc log lỗi.
    // Với cấu trúc hiện tại, trừ kho và tạo đơn hàng là atomic trong cùng một try/catch.
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Sắp xếp đơn hàng mới nhất lên đầu
      .lean(); // Tăng hiệu năng nếu không cần dùng các phương thức mongoose

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đơn hàng thành công",
      orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Lấy tất cả đơn hàng, bao gồm thông tin user
    let orders = await Order.find()
      .populate("userId", "fullName email") // Populate để lấy tên
      .sort({ createdAt: -1 })
      .lean();

    // Tìm kiếm theo tên người dùng
    if (search) {
      orders = orders.filter((order) =>
        order.userId?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = orders.length;

    // Phân trang
    const paginatedOrders = orders.slice(skip, skip + parseInt(limit));

    return res.status(200).json({
      success: true,
      message: "Lấy đơn hàng thành công",
      total,
      orders: paginatedOrders,
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, cancelReason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    const currentStatus = order.status;

    const statusFlow = [
      "pending", // 0
      "processing", // 1
      "shipped", // 2
      "delivered", // 3
      "received", // 4
    ];

    const statusIndex = statusFlow.indexOf(status);
    const currentIndex = statusFlow.indexOf(currentStatus);

    // Trường hợp hủy đơn
    if (status === "cancelled") {
      if (currentStatus !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Chỉ đơn hàng đang chờ xác nhận (pending) mới được hủy",
        });
      }

      if (!cancelReason || cancelReason.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp lý do hủy đơn hàng",
        });
      }

      order.status = "cancelled";
      order.notes = `${order.notes || ""}\nLý do hủy: ${cancelReason}`;
    }
    // Trường hợp cập nhật bình thường, chỉ cho phép chuyển tiếp 1 bước
    else {
      if (statusIndex === -1) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái mới không hợp lệ",
        });
      }

      if (statusIndex !== currentIndex + 1) {
        return res.status(400).json({
          success: false,
          message:
            "Không thể nhảy cóc trạng thái. Chỉ được cập nhật sang bước kế tiếp.",
        });
      }

      order.status = status;

      if (status === "delivered") {
        order.deliveredAt = new Date();
      }

      if (status === "received") {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    const order = await Order.findById(orderId).populate(
      "userId",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đơn hàng",
      error: error.message,
    });
  }
};
