// const { Router } = require("express");
// const { todayProgress, weeklyProgress, recentAchievements } = require("../controllers/progress");
// const { auth } = require("../middleware/auth");
// const r = Router();
// const guard = auth(process.env.JWT_SECRET, process.env.COOKIE_NAME);
// r.get("/progress/today", guard, todayProgress);
// r.get("/progress/weekly", guard, weeklyProgress);
// r.get("/progress/achievements/recent", guard, recentAchievements);
// module.exports = r;





const { Router } = require("express");
const {
  todayProgress, weeklyProgress, recentAchievements,
  pageRead, chaptersProgress, subjectsProgress
} = require("../controllers/progress");
const { auth } = require("../middleware/auth");

const r = Router();
const guard = auth(process.env.JWT_SECRET, process.env.COOKIE_NAME);

r.get("/progress/today", guard, todayProgress);
r.get("/progress/weekly", guard, weeklyProgress);
r.get("/progress/achievements/recent", guard, recentAchievements);

r.post("/progress/page-read", guard, pageRead);          // NEW
r.get("/progress/chapters", guard, chaptersProgress);    // NEW
r.get("/progress/subjects", guard, subjectsProgress);    // NEW

module.exports = r;
