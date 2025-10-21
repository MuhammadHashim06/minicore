const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const User = require("../models/User");

async function register(req, res) {
  const { email, password, grade, role } = req.body || {};
  if (!email || !password || !grade) return res.status(400).json({ error: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });
  const passwordHash = await argon2.hash(password);
  const user = await User.create({ email, passwordHash, grade, role: role || 'user', xp: 0, level: 1, badges: [] });
  const token = jwt.sign({ id: user._id, grade: user.grade }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 7*24*3600*1000 });
  res.json({ id: user._id, email: user.email, grade: user.grade, xp: user.xp, level: user.level, badges: user.badges });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await argon2.verify(user.passwordHash, password || "");
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, grade: user.grade }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7*24*3600*1000 });
  res.json({ id: user._id, email: user.email, grade: user.grade, xp: user.xp, level: user.level, badges: user.badges });
}

async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  console.log(user.role);
  
  res.json({ id: user._id, email: user.email, grade: user.grade, xp: user.xp, level: user.level, badges: user.badges, role: user.role });
}

async function logout(_req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ ok: true });
}

module.exports = { register, login, me, logout };
