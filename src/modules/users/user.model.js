

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatarUrl: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    address: { type: [String], default: [] },
    bio: { type: String, default: "" },
    role: {
      type: String,
      enum: ["Admin", "Member", "SuperAdmin", "Manager"],
      default: "Member",
    },
    phoneNumber: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    lastestLogin: { type: Date, default: null },
    isVerifyEmail: { type: Boolean, default: false },
    isVerifyPhoneNumber: { type: Boolean, default: false },
    is2StepVerify: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", userSchema);
