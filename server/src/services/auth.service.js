import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Brokerage from "../models/brokerage.model.js";
import { config } from "../config/env.js";

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    brokerageId: user.brokerageId?.toString() || null,
    isActive: user.isActive !== false,
  };
}

function createToken(user) {
  return jwt.sign({ sub: user._id.toString() }, config.jwtSecret, { expiresIn: "1d" });
}

export async function authenticateUser(email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || typeof password !== "string" || !password) throw new Error("INVALID_CREDENTIALS");

  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  const validPassword = user && await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) throw new Error("INVALID_CREDENTIALS");

  return { token: createToken(user), user: toSafeUser(user) };
}

export function findAuthenticatedUser(userId) {
  return User.findById(userId).select("-passwordHash");
}
