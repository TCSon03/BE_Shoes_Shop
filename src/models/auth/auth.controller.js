import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
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
      success: true,
      message: "Đăng kí tài khoản thành công",
      newUser,
    });
  } catch (error) {
    console.error("Lỗi đăng kí:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Thông tin tài khoản không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Thông tin tài khoản không dúng" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, "sonsamset", {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
