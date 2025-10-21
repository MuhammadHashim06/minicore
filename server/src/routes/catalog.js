// const { Router } = require("express");
// const { listSubjects, listChapters, getChapter, getQuiz } = require("../controllers/catalog");
// const { auth } = require("../middleware/auth");
// const r = Router();
// const guard = auth(process.env.JWT_SECRET, process.env.COOKIE_NAME);
// r.get("/subjects", guard, listSubjects);
// r.get("/subjects/:slug/chapters", guard, listChapters);
// r.get("/chapters/:slug", guard, getChapter);
// r.get("/chapters/:slug/quiz", guard, getQuiz);


// module.exports = r;





const { Router } = require("express");
const { listSubjects, listChapters, getChapter, getQuiz, getChapterOverview, getChapterPage } = require("../controllers/catalog");
const { auth } = require("../middleware/auth");
const r = Router();
const guard = auth(process.env.JWT_SECRET, process.env.COOKIE_NAME);

r.get("/subjects", guard, listSubjects);
r.get("/subjects/:slug/chapters", guard, listChapters);

r.get("/chapters/:slug", guard, getChapter); // existing (kept)
r.get("/chapters/:slug/overview", guard, getChapterOverview); // NEW
r.get("/chapters/:slug/page/:idx", guard, getChapterPage);    // NEW

r.get("/chapters/:slug/quiz", guard, getQuiz);
module.exports = r;
