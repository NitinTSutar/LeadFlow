export function normalizeLeadEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function normalizeLeadPhone(phone) {
  return typeof phone === "string" ? phone.replace(/[^\d+]/g, "") : "";
}
