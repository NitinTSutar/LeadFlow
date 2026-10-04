import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { findAuthenticatedUser } from "../services/auth.service.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[config.authCookieName];
  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await findAuthenticatedUser(payload.sub);
    if (!user) return res.status(401).json({ message: "Authentication required." });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Authentication required." });
  }
}
