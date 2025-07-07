import User from "../user/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  console.log("👉 req.body nhận được:", req.body);
  try {
    const { fullName, email, phone, password } = req.body;

    // kiem tra email da ton tai chua
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    // kiem tra phone da ton tai chua
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        message: "Phone đã được sử dụng",
      });
    }

    // ma hoa pass
    const hashedPassword = await bcrypt.hash(password, 10);

    // tao tk
    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "member",
    });

    //tra ket qua
    return res.status(201).json({
      message: "Đăng kí tài khoản thành công",
      newUser,
    });
  } catch (error) {
    console.error("Lỗi đăng kí:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const loginUser = async (req, res) => {};
