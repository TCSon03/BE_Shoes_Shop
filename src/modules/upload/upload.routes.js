import express from "express";
import multer from "multer";
import { storage } from "../../common/configs/cloudinary.js";

const upload = multer({ storage });
const uploadRouter = express.Router();

// POST /api/upload/logo
uploadRouter.post("/logo", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file được upload" });
  }

  return res.status(200).json({
    message: "Upload thành công",
    imageUrl: req.file.path,
  });
});

export default uploadRouter;
