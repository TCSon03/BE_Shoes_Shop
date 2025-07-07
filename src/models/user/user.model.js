import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: {
      street: { type: String, default: "" },
      ward: { type: String, default: "" },
      district: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    avatar: {
      type: String,
      default:
        "https://tamkytourism.com/wp-content/uploads/2025/02/avatar-vo-tri-9.jpg",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    isVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: ["member", "manager", "admin", "superAdmin"],
      default: "member",
    },

    status: { type: Boolean, default: false },

    lastLogin: {
      type: Date,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
