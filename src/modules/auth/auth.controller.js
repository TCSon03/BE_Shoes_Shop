import handleAsync from "./../../common/utils/handleAsync.js";
import createError from "./../../common/utils/error.js";
import createReponse from "./../../common/utils/reponse.js";
import MESSAGES from "./../../common/contstants/messages.js";
import User from "../users/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_EXPIRATION,
  JWT_SECRET,
  JWT_SECRET_KEY_FOR_EMAIL,
  JWT_EXPIRES_IN_FOR_EMAIL,
} from "../../common/configs/enviroments.js";
import sendEmail from "../../common/utils/mailSender.js";

export const authRegister = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createError(400, MESSAGES.AUTH.EMAIL_ALREADY_EXISTS));
  }

  //  hash password: mã hóa mật khẩu
  const salt = bcrypt.genSaltSync(10); //giải thich dòng này: // Tạo một chuỗi salt ngẫu nhiên với độ dài 10
  console.log(salt); // In ra chuỗi salt để kiểm tra

  const hash = bcrypt.hashSync(password, salt); ///giải thich dòng này: // Mã hóa mật khẩu bằng thuật toán bcrypt với chuỗi salt đã tạo
  console.log(hash); // In ra mật khẩu đã mã hóa để kiểm tra

  //   create user
  const newUser = await User.create({
    ...req.body,
    password: hash,
    role: "Member", // Mặc định là Member
  });
  //   nếu không tạo được người dùng mới, trả về lỗi
  if (!newUser) {
    return next(createError(500, MESSAGES.AUTH.REGISTER_FAILED));
  }

  // verify email
  const verifyEmailToken = jwt.sign(
    { id: newUser._id },
    JWT_SECRET_KEY_FOR_EMAIL,
    { expiresIn: JWT_EXPIRES_IN_FOR_EMAIL }
  );

  const verifyEmailLink = `http://localhost:5173/auth/verify-email/${verifyEmailToken}`;

  sendEmail(
    newUser.email,
    "Xác minh email",
    `
    Xin chào ${newUser.fullName || "Người dùng"},
    
    Vui lòng nhấp vào liên kết dưới đây để xác minh địa chỉ email của bạn:
    
    <a href="${verifyEmailLink}">Xác minh email</a>
    
    Nếu bạn không yêu cầu xác minh này, vui lòng bỏ qua email này.
    
    Cảm ơn bạn,
    Đội ngũ hỗ trợ
  `
  ).catch((error) => {
    console.error("Gửi email xác minh thất bại:", error);
    return next(createError(500, MESSAGES.AUTH.EMAIL_SEND_FAILED));
  });

  //   reponse nếu tạo người dùng thành công
  newUser.password = undefined; // ẩn mật khẩu trong phản hồi
  //   trả về phản hồi thành công với mã trạng thái 201 (Created)
  return res
    .status(201)
    .json(createReponse(true, 201, MESSAGES.AUTH.REGISTER_SUCCESS, newUser));
});

export const authLogin = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return next(createError(400, MESSAGES.AUTH.USER_NOT_FOUND));
  }

  const isMatch = bcrypt.compareSync(password, existingUser.password);
  if (!isMatch) {
    return next(createError(400, MESSAGES.AUTH.LOGIN_FAILED));
  }

  // Tạo JWT token
  const accessToken = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
  // Nếu tạo được token, trả về thông tin người dùng và token
  if (accessToken) {
    existingUser.password = undefined; // ẩn mật khẩu trong phản hồi
    return res.status(200).json(
      createReponse(true, 200, MESSAGES.AUTH.LOGIN_SUCCESS, {
        user: existingUser,
        accessToken,
      })
    );
  }
  // Nếu không tạo được token, trả về lỗi
  return next(createError(500, MESSAGES.AUTH.LOGIN_FAILED));
});

export const authLogout = handleAsync(async (req, res, next) => {});

export const authRefreshToken = handleAsync(async (req, res, next) => {});

export const authForgotPassword = handleAsync(async (req, res, next) => {});

export const authResetPassword = handleAsync(async (req, res, next) => {});
