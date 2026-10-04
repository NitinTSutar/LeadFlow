import User from "../models/user.model.js";
import { hashPassword, normalizeEmail, toSafeUser } from "./auth.service.js";

export async function createPlatformAdmin({ name, email, password }) {
  const existingAdmin = await User.exists({ role: "platformAdmin" });
  if (existingAdmin) throw new Error("PLATFORM_ADMIN_EXISTS");

  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "platformAdmin",
  });

  return toSafeUser(user);
}
