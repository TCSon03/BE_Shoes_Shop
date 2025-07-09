import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Không có token, truy cập bị từ chối",
    });
  }

  jwt.verify(token, "sonsamset", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
    req.user = user;
    next();
  });
};
