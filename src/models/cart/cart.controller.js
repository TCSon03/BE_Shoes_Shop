import Variant from "../variant/variant.model.js";
import Cart from "./cart.model.js";

export const createCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { variantId, quantity } = req.body;

    // Optional: Kiểm tra variant có tồn tại không
    const variant = await Variant.findById(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Biến thể sản phẩm không tồn tại" });
    }

    // Kiểm tra xem user đã có giỏ chưa
    let cart = await Cart.findOne({ userId });

    // Nếu chưa có giỏ → tạo mới
    if (!cart) {
      const newCart = new Cart({
        userId,
        items: [{
          variantId,
          quantity,
          priceAtAdded: 0, // bạn có thể lấy giá từ Variant nếu muốn
        }],
      });
      await newCart.save();
      return res.status(201).json({
        success: true,
        message: "Đã tạo giỏ hàng mới và thêm sản phẩm",
        cart: newCart,
      });
    }

    // Đã có giỏ → kiểm tra item đã tồn tại hay chưa
    const existingItemIndex = cart.items.findIndex(
      item => item.variantId.toString() === variantId
    );

    if (existingItemIndex !== -1) {
      // Nếu tồn tại → cập nhật số lượng
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Nếu chưa tồn tại → thêm mới
      cart.items.push({
        variantId,
        quantity,
        priceAtAdded: 0, // bạn có thể lấy giá từ Variant nếu muốn
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      cart,
    });

  } catch (err) {
    console.error("Lỗi khi thêm giỏ hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.variantId",
        populate: {
          path: "productId",
          model: "Product",
          select: "name slug thumbnail brandId categoryId", // tùy chọn thêm
        },
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { variantId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn hoặc bằng 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tồn tại",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variantId.toString() === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
      });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { variantId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tồn tại",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.variantId.toString() === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
      });
    }

    // Xóa sản phẩm
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};


