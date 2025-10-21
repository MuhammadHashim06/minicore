const jwt = require("jsonwebtoken");
function auth(secret, cookieName) {
  return (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) return res.status(401).json({ error: "Unauthenticated" });
    try {
      const payload = jwt.verify(token, secret);
      req.user = { id: payload.id, grade: payload.grade };
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
module.exports = { auth };
