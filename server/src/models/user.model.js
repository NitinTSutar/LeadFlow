import mongoose from "mongoose";

export const USER_ROLES = [
  "platformAdmin",
  "brokerageAdmin",
  "advisor",
  "client",
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, required: true },
    isActive: { type: Boolean, default: true, index: true },
    brokerageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brokerage",
      index: true,
      required: function requiredBrokerageForTenantUser() {
        return this.role !== "platformAdmin";
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 }, { unique: true, partialFilterExpression: { role: "platformAdmin" } });

const User = mongoose.model("User", userSchema);

export default User;
