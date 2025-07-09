import mongoose from "mongoose";
import Brand from "./brand.model.js";

export const createBrand = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existingName = await Brand.findOne({ name });
    if (existingName) {
      return res.status(404).json({
        message: "Name đã tồn tại",
      });
    }

    const existingSlug = await Brand.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: "Slug đã tồn tại" });
    }

    const newBrand = await Brand.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Tạo Brand thành công",
      brand: newBrand,
    });
  } catch (error) {
    console.error("Lỗi tạo Brand:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getAllBrand = async (req, res) => {
  try {
    const data = await Brand.find();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Brand thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const data = await Brand.findById(id);
    if (!data) {
      return res.status(400).json({
        message: "Brand không tồn tại",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết Brand thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết Brand", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }
    const brand = await Brand.findOne({ _id: id, deletedAt: null });
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand không tồn tại hoặc đã bị xóa",
      });
    }

    const updated = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
      success: true,
      message: "Cập nhật Brand thành công",
      brand: updated,
    });
  } catch (error) {
    console.error("Lỗi cập nhật Brand", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id không hợp lệ",
      });
    }
    const data = await Brand.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Brand không tồn tại",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Xóa Brand thành công" });
  } catch (error) {
    console.error("Lỗi xóa Brand", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
