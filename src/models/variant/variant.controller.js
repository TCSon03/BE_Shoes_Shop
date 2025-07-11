import mongoose from "mongoose";
import Product from "../product/product.model.js";
import Variant from "./variant.model.js";

export const createVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size, price, stock, image } = req.body;

    if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "productId không hợp lệ",
      });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Product không tồn tại",
      });
    }

    const isExist = await Variant.findOne({
      productId,
      size,
      color,
    });

    if (isExist) {
      return res.status(409).json({
        message: `Biến thể màu "${color}" và size ${size} đã tồn tại cho sản phẩm này`,
      });
    }

    const newVariant = await Variant.create({
      productId,
      color,
      size,
      price,
      stock,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo biến thể thành công",
      variant: newVariant,
    });
  } catch (error) {
    console.error("Lỗi tạo Variant:", error);
    return res.status(500).json({
      success: false,
      message: "Tạo Variant thất bại",
      error: error.message,
    });
  }
};

export const getAllVariant = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "productId không hợp lệ",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    const variants = await Variant.find({ productId });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách biến thể thành công",
      data: variants,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách biến thể:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách biến thể",
      error: error.message,
    });
  }
};

export const getVariantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID biến thể không hợp lệ",
      });
    }

    const variant = await Variant.findById(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy biến thể",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết biến thể thành công",
      data: variant,
    });
  } catch (error) {
    console.error("Lỗi lấy biến thể:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết biến thể",
      error: error.message,
    });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const deletedVariant = await Variant.findByIdAndDelete(id);

    if (!deletedVariant) {
      return res.status(404).json({
        success: false,
        message: "Biến thể không tồn tại",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xoá biến thể thành công",
      data: deletedVariant,
    });
  } catch (error) {
    console.error("Lỗi xoá biến thể:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xoá biến thể",
      error: error.message,
    });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, size, price, stock, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID biến thể không hợp lệ",
      });
    }

    const existingVariant = await Variant.findById(id);
    if (!existingVariant) {
      return res.status(404).json({
        success: false,
        message: "Biến thể không tồn tại",
      });
    }

    const normalizedColor = color?.trim().toLowerCase();

    const isDuplicate = await Variant.findOne({
      _id: { $ne: id }, 
      productId: existingVariant.productId,
      color: normalizedColor || existingVariant.color,
      size: size ?? existingVariant.size,
    });

    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        message: `Biến thể màu "${normalizedColor}" và size ${size} đã tồn tại cho sản phẩm này`,
      });
    }

    existingVariant.color = normalizedColor || existingVariant.color;
    existingVariant.size = size ?? existingVariant.size;
    existingVariant.price = price ?? existingVariant.price;
    existingVariant.stock = stock ?? existingVariant.stock;
    existingVariant.image = image || existingVariant.image;

    await existingVariant.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật biến thể thành công",
      data: existingVariant,
    });
  } catch (error) {
    console.error("Lỗi cập nhật biến thể:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật biến thể",
      error: error.message,
    });
  }
};
