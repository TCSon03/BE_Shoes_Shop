const validation = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details[0].message; // Lấy thông báo lỗi đầu tiên
      return res.status(400).json({ "Valid body request": errorMessage });
    }
    req.data = value; // Lưu dữ liệu đã xác thực
    next();
  } catch (err) {
    console.error("Lỗi trong middleware validation:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export default validation;