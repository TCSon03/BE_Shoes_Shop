export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Không có thông tin vai trò người dùng",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Bạn không có quyền truy cập. Yêu cầu vai trò: ${roles.join(
          ", "
        )}`,
      });
    }
    next();
  };
};
