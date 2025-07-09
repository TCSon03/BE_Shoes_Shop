const validation = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }
    req.body = value; // Lưu dữ liệu đã xác thực
    next();
  } catch (err) {
    console.error("Lỗi trong middleware validation:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export default validation;
