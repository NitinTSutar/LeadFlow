import { authenticateUser, findAuthenticatedUser, toSafeUser } from "../services/auth.service.js";
import { config } from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: config.cookieSecure ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

export async function login(req, res) {
  const { email, password } = req.body || {};
  try {
    const { token, user } = await authenticateUser(email, password);
    res.cookie(config.authCookieName, token, cookieOptions);
    return res.json({ user });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") return res.status(401).json({ message: "Invalid email or password." });
    throw error;
  }
}

export function logout(req, res) {
  res.clearCookie(config.authCookieName, {
    httpOnly: true, secure: config.cookieSecure, sameSite: config.cookieSecure ? "none" : "lax",
  });
  return res.status(204).send();
}

export async function me(req, res) {
  const user = await findAuthenticatedUser(req.user._id);
  if (!user) return res.status(401).json({ message: "Authentication required." });
  return res.json({ user: toSafeUser(user) });
}
