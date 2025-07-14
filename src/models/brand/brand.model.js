import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
