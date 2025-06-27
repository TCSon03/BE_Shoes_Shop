import mongoose, { Schema } from "mongoose";

const attributeValueSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
    slugAttriValue: {
      type: String,
      required: true,
    },
    attributeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AttributeValue", attributeValueSchema);
