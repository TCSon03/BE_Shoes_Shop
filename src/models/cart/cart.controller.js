import mongoose from "mongoose";
import Product from "../product/product.model.js";
import Variant from "../variant/variant.model.js";
import Cart from "./cart.model.js";
import {
  addItemToCartSchema,
  updateCartItemQuantitySchema,
} from "./cart.validation.js";

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token đã xác thực

    // 1. Validate dữ liệu đầu vào
    const { variantId, quantity } = await addItemToCartSchema.validateAsync(
      req.body,
      { abortEarly: false }
    );

    // 2. Kiểm tra biến thể có tồn tại và còn hàng không
    const variant = await Variant.findById(variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Biến thể không tồn tại.",
      });
    }

    // Kiểm tra xem sản phẩm có bị xóa mềm không (nếu có trường deletedAt trong Product)
    const product = await Product.findById(variant.productId);
    if (!product || product.deletedAt) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm liên quan đến biến thể này không còn khả dụng.",
      });
    }

    // Kiểm tra số lượng tồn kho
    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Số lượng yêu cầu vượt quá số lượng tồn kho. Chỉ còn ${variant.stock} sản phẩm này.`,
      });
    }

    // 3. Tìm hoặc tạo giỏ hàng cho người dùng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // 4. Thêm hoặc cập nhật sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.variantId.toString() === variantId
    );

    if (itemIndex > -1) {
      // Sản phẩm đã có trong giỏ, cập nhật số lượng
      const currentQuantityInCart = cart.items[itemIndex].quantity;
      const newTotalQuantity = currentQuantityInCart + quantity;

      if (variant.stock < newTotalQuantity) {
        return res.status(400).json({
          success: false,
          message: `Không đủ số lượng trong kho. Bạn đã có ${currentQuantityInCart} và yêu cầu thêm ${quantity}. Chỉ còn ${variant.stock} sản phẩm này.`,
        });
      }
      cart.items[itemIndex].quantity = newTotalQuantity;
    } else {
      // Thêm sản phẩm mới vào giỏ
      cart.items.push({ variantId, quantity });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Sản phẩm đã được thêm vào giỏ hàng.",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    // Xử lý lỗi validation từ Joi
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ.",
        errors: error.details.map((e) => e.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sản phẩm vào giỏ hàng.",
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token đã xác thực

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.variantId", // Populate thông tin biến thể
      populate: {
        path: "productId", // Trong biến thể, populate thông tin sản phẩm
        populate: [
          { path: "brandId" }, // Trong sản phẩm, populate thương hiệu
          { path: "categoryId" }, // Trong sản phẩm, populate danh mục
        ],
      },
    });

    if (!cart) {
      // Nếu không tìm thấy giỏ hàng, trả về giỏ hàng rỗng
      return res.status(200).json({
        success: true,
        message: "Giỏ hàng của bạn đang trống.",
        cart: {
          userId,
          items: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy giỏ hàng thành công.",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy giỏ hàng.",
      error: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token đã xác thực
    const { variantId } = req.params; // Lấy variantId từ params

    // Kiểm tra variantId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({
        success: false,
        message: "ID biến thể không hợp lệ.",
      });
    }

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng của bạn.",
      });
    }

    // Lọc bỏ sản phẩm cần xóa
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.variantId.toString() !== variantId
    );

    if (cart.items.length === initialLength) {
      // Nếu độ dài không đổi, nghĩa là không tìm thấy item để xóa
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không có trong giỏ hàng của bạn.",
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
      cart,
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng.",
      error: error.message,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token đã xác thực

    // 1. Validate dữ liệu đầu vào
    const { variantId, newQuantity } =
      await updateCartItemQuantitySchema.validateAsync(req.body, {
        abortEarly: false,
      });

    // 2. Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng của bạn.",
      });
    }

    // 3. Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.variantId.toString() === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không có trong giỏ hàng của bạn.",
      });
    }

    // 4. Xử lý logic cập nhật số lượng
    if (newQuantity === 0) {
      // Nếu số lượng mới là 0, xóa sản phẩm khỏi giỏ hàng
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        cart,
      });
    } else {
      // Cập nhật số lượng
      const variant = await Variant.findById(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Biến thể không tồn tại.",
        });
      }

      if (variant.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Số lượng yêu cầu vượt quá số lượng tồn kho. Chỉ còn ${variant.stock} sản phẩm này.`,
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
      await cart.save();
      res.status(200).json({
        success: true,
        message: "Số lượng sản phẩm trong giỏ hàng đã được cập nhật.",
        cart,
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng giỏ hàng:", error);
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ.",
        errors: error.details.map((e) => e.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật giỏ hàng.",
      error: error.message,
    });
  }
};
