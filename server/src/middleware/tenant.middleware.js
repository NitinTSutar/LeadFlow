export function requireBrokerageContext(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  if (req.user.role !== "platformAdmin" && !req.user.brokerageId) {
    return res.status(403).json({ message: "Brokerage context is required." });
  }
  req.brokerageId = req.user.brokerageId || null;
  return next();
}

export function brokerageFilter(user, field = "brokerageId") {
  return user.role === "platformAdmin" ? {} : { [field]: user.brokerageId };
}
