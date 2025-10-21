const { Router } = require("express");
const { submitQuiz } = require("../controllers/quiz");
const { auth } = require("../middleware/auth");
const r = Router();
r.post("/submit", auth(process.env.JWT_SECRET, process.env.COOKIE_NAME), submitQuiz);
module.exports = r;
