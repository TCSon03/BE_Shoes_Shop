import mongoose from "mongoose";
import Brand from "../brand/brand.model.js";
import Category from "../category/category.model.js";
import Product from "./product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, brandId, categoryId, thumbnail } =
      req.body;

    const existingName = await Product.findOne({ name });
    if (existingName) {
      return res.status(400).json({
        message: "Name đã tồn tại",
      });
    }
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        message: "Slug đã tồn tại",
      });
    }

    const existingBrand = await Brand.findById(brandId);
    if (!existingBrand) {
      return res.status(400).json({
        message: "Brand không tồn tại",
      });
    }

    const existingCate = await Category.findById(categoryId);
    if (!existingCate) {
      return res.status(400).json({
        message: "Category không tồn tại",
      });
    }

    const newProduct = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Tạo Product thành công",
      newProduct,
    });
  } catch (error) {
    console.error("Lỗi tạo Product", error);
    return res.status(500).json({
      success: false,
      message: "Tạo Product thất bại",
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find({ deletedAt: null });
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Product thành công",
      product,
    });
  } catch (error) {
    console.error("Lỗi lấy Product", error);
    return res.status(500).json({
      success: false,
      message: "Lấy danh sách Product thất bại",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id product không hợp lệ",
      });
    }

    const productId = await Product.findById(id);
    if (!productId) {
      return res.status(400).json({
        message: "Product không tồn tại",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết Product thành công",
      product: productId,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết Product", error);
    return res.status(500).json({
      success: false,
      message: "Lấy chi tiết Product thất bại",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, slug, brandId, categoryId } = req.body;

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id không hợp lệ",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "Product không tồn tại",
      });
    }

    const existingName = await Product.findOne({ name, _id: { $ne: id } });
    if (existingName) {
      return res.status(400).json({
        message: "Name đã tồn tại",
      });
    }
    const existingSlug = await Product.findOne({ slug, _id: { $ne: id } });
    if (existingSlug) {
      return res.status(400).json({
        message: "Slug đã tồn tại",
      });
    }

    const existingBrand = await Brand.findById(brandId);

    if (!existingBrand) {
      return res.status(400).json({
        message: "Brand không tồn tại",
      });
    }

    const existingCate = await Category.findById(categoryId);
    if (!existingCate) {
      return res.status(400).json({
        message: "Category không tồn tại",
      });
    }

    const updatePro = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Update Product thành công",
      product: updatePro,
    });
  } catch (error) {
    console.error("Lỗi cập nhật Product", error);
    return res.status(500).json({
      success: false,
      message: "Cập nhật Product thất bại",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id không hợp lệ",
      });
    }

    const productDelete = await Product.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (!productDelete) {
      return res.status(404).json({
        success: false,
        message: "Product không tồn tại hoặc chưa bị xóa mềm",
      });
    }

    const data = await Product.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Product không tồn tại",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Xóa Product thành công" });
  } catch (error) {
    console.error("Lỗi xóa Product", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const sortDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Id Product không hợp lệ",
      });
    }

    const productToDelete = await Product.findOne({ _id: id, deletedAt: null });
    if (!productToDelete) {
      return res.status(404).json({
        success: false,
        message: "Product không tồn tại hoặc đã bị xóa mềm",
      });
    }

    const sortProduct = await Product.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Xóa mềm Product thành công",
      product: sortProduct,
    });
  } catch (error) {
    console.error("Lỗi xóa mềm: ", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id Product không hợp lệ",
      });
    }

    const productToHardDelete = await Product.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (!productToHardDelete) {
      return res.status(404).json({
        success: false,
        message: "Product không tồn tại hoặc chưa xóa mềm",
      });
    }

    const restoreProduct = await Product.findByIdAndUpdate(
      id,
      { deletedAt: null },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Khôi phục Product thành công",
      product: restoreProduct,
    });
  } catch (error) {
    console.error("Lỗi khôi phục Product:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
