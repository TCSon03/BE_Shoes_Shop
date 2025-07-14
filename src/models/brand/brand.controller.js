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

// export const getAllBrand = async (req, res) => {

//   try {
//     const data = await Brand.find({ deletedAt: null });

//     return res.status(200).json({
//       success: true,
//       message: "Lấy danh sách Brand thành công",
//       data,
//     });
//   } catch (error) {
//     console.error("Lỗi lấy danh sách", error);
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi server",
//       error: error.message,
//     });
//   }
// };

export const getAllBrand = async (req, res) => {
  try {
    // Lấy các tham số từ query string
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = parseInt(req.query.limit) || 5; // Số lượng bản ghi mỗi trang, mặc định là 5
    const search = req.query.search || ""; // Từ khóa tìm kiếm, mặc định là rỗng

    // Tính toán số lượng bản ghi cần bỏ qua
    const skip = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm
    // Tìm kiếm không phân biệt chữ hoa chữ thường trên trường 'name'
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Kết hợp điều kiện tìm kiếm với điều kiện deletedAt: null
    const query = {
      ...searchQuery,
      deletedAt: null,
    };

    // Lấy tổng số bản ghi phù hợp với điều kiện tìm kiếm (không phân trang)
    const totalBrands = await Brand.countDocuments(query);

    // Lấy dữ liệu Brand với phân trang và tìm kiếm
    const data = await Brand.find(query).skip(skip).limit(limit);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalBrands / limit);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Brand thành công",
      data,
      pagination: {
        totalItems: totalBrands,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách Brand:", error);
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

    const brandDelete = await Brand.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (!brandDelete) {
      return res.status(404).json({
        success: false,
        message: "Brand không tồn tại hoặc chưa bị xóa mềm",
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

export const sortDeleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Id Brand không hợp lệ",
      });
    }

    const brandToDelete = await Brand.findOne({ _id: id, deletedAt: null });
    if (!brandToDelete) {
      return res.status(404).json({
        success: false,
        message: "Brand không tồn tại hoặc đã bị xóa mềm",
      });
    }

    const sortBrand = await Brand.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Xóa mềm Brand thành công",
      brand: sortBrand,
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

export const restoreBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Id Brand không hợp lệ",
      });
    }

    const brandToHardDelete = await Brand.findOne({
      _id: id,
      deletedAt: { $ne: null },
    });
    if (!brandToHardDelete) {
      return res.status(404).json({
        success: false,
        message: "Brand không tồn tại hoặc chưa xóa mềm",
      });
    }

    const restoreBrand = await Brand.findByIdAndUpdate(
      id,
      { deletedAt: null },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Khôi phục Brand thành công",
      brand: restoreBrand,
    });
  } catch (error) {
    console.error("Lỗi khôi phục Brand:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
export const getSoftDeletedBrand = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Chỉ lấy các bản ghi có deletedAt KHÔNG phải là null
    const query = {
      ...searchQuery,
      deletedAt: { $ne: null },
    };

    const totalBrands = await Brand.countDocuments(query);
    const data = await Brand.find(query).skip(skip).limit(limit);

    const totalPages = Math.ceil(totalBrands / limit);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Brand đã xóa mềm thành công",
      data,
      pagination: {
        totalItems: totalBrands,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách Brand đã xóa mềm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
