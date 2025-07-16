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

export const getAllVariantProduct = async (req, res) => {
  try {
    const {
      search = "",
      minPrice,
      maxPrice,
      sortByPrice, // 'asc' cho thấp đến cao, 'desc' cho cao đến thấp
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      deletedAt: null, // Chỉ lấy các variant chưa bị xóa mềm
    };

    let productIds = [];

    // 1. Tìm kiếm theo tên sản phẩm (Product name)
    if (search) {
      const products = await Product.find({
        name: { $regex: search, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
        deletedAt: null,
      }).select("_id"); // Chỉ lấy ID của sản phẩm

      productIds = products.map((p) => p._id);

      if (productIds.length === 0) {
        // Nếu không tìm thấy sản phẩm nào khớp, trả về mảng rỗng ngay lập tức
        return res.status(200).json({
          message: "Không tìm thấy biến thể nào.",
          variants: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            totalItems: 0,
          },
        });
      }
      query.productId = { $in: productIds };
    }

    // 2. Lọc theo giá (minPrice, maxPrice)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // 3. Phân trang
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const options = {
      skip: skip,
      limit: parseInt(limit),
      sort: {},
    };

    // 4. Sắp xếp theo giá
    if (sortByPrice) {
      if (sortByPrice === "asc") {
        options.sort.price = 1; // Tăng dần (thấp đến cao)
      } else if (sortByPrice === "desc") {
        options.sort.price = -1; // Giảm dần (cao xuống thấp)
      }
    } else {
      // Mặc định sắp xếp theo thời gian tạo nếu không có sortByPrice
      options.sort.createdAt = -1;
    }

    // Lấy tổng số biến thể khớp với điều kiện tìm kiếm và lọc
    const totalVariants = await Variant.countDocuments(query);

    // Thực hiện truy vấn biến thể
    const variants = await Variant.find(query, null, options)
      .populate("productId", "name slug brandId categoryId thumbnail") // Lấy thông tin cần thiết từ Product
      .lean(); // Chuyển kết quả Mongoose Document thành Plain JavaScript Object

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(totalVariants / parseInt(limit));

    res.status(200).json({
      message: "Lấy danh sách biến thể thành công.",
      variants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalItems: totalVariants,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy biến thể:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi server.", error: error.message });
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
      .populate("productId", "name thumbnail");

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
    const { id } = req.params; // Lấy ID của biến thể từ tham số URL

    // 1. Tìm biến thể chính theo ID
    const mainVariant = await Variant.findById(id)
      .populate({
        path: "productId", // Populate thông tin của Product
        populate: [
          { path: "brandId" }, // Populate thông tin của Brand trong Product
          { path: "categoryId" }, // Populate thông tin của Category trong Product
        ],
      })
      .lean(); // Sử dụng .lean() để trả về plain JavaScript object, giúp tăng hiệu suất.

    // Kiểm tra nếu không tìm thấy biến thể chính
    if (!mainVariant) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy biến thể chính." });
    }

    // 2. Tìm TẤT CẢ các biến thể khác thuộc cùng một sản phẩm
    // (sử dụng productId của mainVariant)
    const allRelatedVariants = await Variant.find({
      productId: mainVariant.productId._id, // Lấy tất cả biến thể có cùng productId
      // Nếu bạn có trường `deletedAt` trong Variant model và muốn lọc các biến thể đã xóa mềm, hãy thêm:
      // deletedAt: null,
    })
      .populate({
        path: "productId", // Vẫn populate Product để đảm bảo dữ liệu đầy đủ và nhất quán
        populate: [{ path: "brandId" }, { path: "categoryId" }],
      })
      .lean();

    // 3. Trả về cả biến thể chính và danh sách tất cả các biến thể liên quan
    res.status(200).json({
      message: "Lấy thông tin biến thể và các biến thể liên quan thành công.",
      mainVariant, // Biến thể cụ thể được yêu cầu bằng ID
      allRelatedVariants, // Tất cả các biến thể của cùng một sản phẩm
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin biến thể:", error);
    // Xử lý trường hợp ID không hợp lệ của MongoDB (ví dụ: ID không đúng định dạng)
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID biến thể không hợp lệ." });
    }
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi server.", error: error.message });
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
    const validatedData = await updateVariantValidation.validateAsync(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

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
