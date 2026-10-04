import { createPlatformAdmin } from "../services/dev.service.js";

export async function createPlatformAdminController(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not found." });
  }

  const { name, email, password } = req.body || {};
  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    const user = await createPlatformAdmin({ name, email, password });
    return res.status(201).json({ user });
  } catch (error) {
    if (error.message === "PLATFORM_ADMIN_EXISTS") {
      return res.status(409).json({ message: "A platform administrator already exists." });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "A platform administrator already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(422).json({ message: "Platform administrator validation failed." });
    }
    throw error;
  }
}
