import mongoose from "mongoose";

const colors = ["Red", "Blue", "Black", "White", "Green"];
const sizes = [38, 39, 40, 41, 42, 43, 44];

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    color: {
      type: String,
      enum: colors,
      required: true,
    },
    size: {
      type: Number,
      enum: sizes,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "https://example.com/img/default.jpg",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;
