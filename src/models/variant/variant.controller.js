import mongoose from "mongoose";
import Product from "../product/product.model.js";
import Variant from "./variant.model.js";
import { updateVariantValidation } from "./variant.validation.js";

export const createVariant = async (req, res) => {
  try {
    const { productId, color, size, price, stock, image } = req.body;

    const trimmedProductId = productId.trim();
    if (!trimmedProductId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    const isExist = await Variant.findOne({ productId, size, color });
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
    const { page = 1, limit = 5, search = "", sortPrice = "" } = req.query;

    const searchRegex = new RegExp(search, "i");
    const query = {
      $or: [
        { color: { $regex: searchRegex } },
        { size: isNaN(Number(search)) ? undefined : Number(search) },
      ],
    };

    // Xoá undefined nếu không có số
    if (query.$or[1].size === undefined) {
      query.$or.pop();
    }

    // Xử lý sắp xếp giá: "asc" (tăng dần) hoặc "desc" (giảm dần)
    let sortOption = {};
    if (sortPrice === "asc") {
      sortOption.price = 1;
    } else if (sortPrice === "desc") {
      sortOption.price = -1;
    }

    const total = await Variant.countDocuments(query);
    const variants = await Variant.find(query)
      .sort(sortOption) // áp dụng sắp xếp
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("productId", "name");

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách biến thể sản phẩm thành công",
      data: variants,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách biến thể sản phẩm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
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

    // ✅ Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID biến thể không hợp lệ",
      });
    }

    // ✅ Validate dữ liệu đầu vào bằng Joi
    const validatedData = await updateVariantValidation.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { color, size, price, stock, image } = validatedData;

    // ✅ Tìm biến thể theo ID
    const variant = await Variant.findById(id);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy biến thể",
      });
    }

    // ✅ Kiểm tra trùng lặp với biến thể khác (cùng productId, color, size)
    const duplicate = await Variant.findOne({
      _id: { $ne: id }, // loại chính nó ra
      productId: variant.productId,
      color,
      size,
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `Biến thể với màu "${color}" và size ${size} đã tồn tại cho sản phẩm này`,
      });
    }

    // ✅ Cập nhật biến thể
    variant.color = color;
    variant.size = size;
    variant.price = price;
    variant.stock = stock ?? 0;
    variant.image = image || variant.image;

    // ✅ Lưu lại vào database
    await variant.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật biến thể thành công",
      data: variant,
    });
  } catch (error) {
    console.error("Lỗi cập nhật biến thể:", error);

    // Nếu là lỗi từ Joi
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: error.details.map((e) => e.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật biến thể",
      error: error.message,
    });
  }
};

