import mongoose from "mongoose";
import Category from "./category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existingName = await Category.findOne({ name });
    if (existingName) {
      return res.status(404).json({
        message: "Name đã tồn tại",
      });
    }

    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: "Slug đã tồn tại" });
    }

    const newCategory = await Category.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Tạo Category thành công",
      category: newCategory,
    });
  } catch (error) {
    console.error("Lỗi tạo Category:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const data = await Category.find({ deletedAt: null });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Category thành công",
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

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const data = await Category.findById(id);
    if (!data) {
      return res.status(400).json({
        message: "Category không tồn tại",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết Category thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết Category", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }
    const category = await Category.findOne({ _id: id, deletedAt: null });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category không tồn tại hoặc đã bị xóa",
      });
    }

    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "Cập nhật Category thành công",
      category: updated,
    });
  } catch (error) {
    console.error("Lỗi cập nhật Category", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id không hợp lệ",
      });
    }

    const brandDelete = await Category.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (!brandDelete) {
      return res.status(404).json({
        success: false,
        message: "Category không tồn tại hoặc chưa bị xóa mềm",
      });
    }

    const data = await Category.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category không tồn tại",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Xóa Category thành công" });
  } catch (error) {
    console.error("Lỗi xóa Category", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const sortDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Id Category không hợp lệ",
      });
    }

    const categoryToDelete = await Category.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!categoryToDelete) {
      return res.status(404).json({
        success: false,
        message: "Category không tồn tại hoặc đã bị xóa mềm",
      });
    }

    const sortCategory = await Category.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Xóa mềm Category thành công",
      category: sortCategory,
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

export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id Category không hợp lệ",
      });
    }

    const categoryToHardDelete = await Category.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (!categoryToHardDelete) {
      return res.status(404).json({
        success: false,
        message: "Category không tồn tại hoặc chưa xóa mềm",
      });
    }

    const restoreCategory = await Category.findByIdAndUpdate(
      id,
      { deletedAt: null },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Khôi phục Category thành công",
      category: restoreCategory,
    });
  } catch (error) {
    console.error("Lỗi khôi phục Category:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
