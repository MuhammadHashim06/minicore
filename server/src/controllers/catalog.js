const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");
const EventLog = require("../models/EventLog");
const UCP      = require("../models/UserChapterProgress");

async function listSubjects(req, res) {
  const subjects = await Subject.find({ grade: req.user.grade }).sort({ order: 1 });
  res.json(subjects);
}
async function listChapters(req, res) {
  const subject = await Subject.findOne({ slug: req.params.slug, grade: req.user.grade });
  if (!subject) return res.status(404).json({ error: "Not found" });
  const chapters = await Chapter.find({ subjectId: subject._id, isActive: true }).sort({ order: 1 });
  res.json(chapters);
}
async function getChapter(req, res) {
  const ch = await Chapter.findOne({ slug: req.params.slug });
  if (!ch) return res.status(404).json({ error: "Not found" });
  await EventLog.create({ userId: req.user.id, type: "chapter_view", meta: { chapterId: ch._id }, ts: new Date() });
  res.json(ch);
}
async function getQuiz(req, res) {
  const ch = await Chapter.findOne({ slug: req.params.slug });
  if (!ch) return res.status(404).json({ error: "Not found" });
  const qs = await Question.find({ chapterId: ch._id }).limit(10);
  const sanitized = qs.map(q => ({ _id: q._id, stem: q.stem, options: q.options }));
  res.json({ chapterId: ch._id, questions: sanitized });
}

// GET /chapters/:slug/overview
async function getChapterOverview(req, res) {
  const ch = await Chapter.findOne({ slug: req.params.slug });
  if (!ch) return res.status(404).json({ error: "Not found" });

  // user progress
  const ucp = await UCP.findOne({ userId: req.user.id, chapterId: ch._id });
  const readCount = ucp?.readPages?.length || 0;
  const total = ch.pages.length || 0;
  const percent = total ? Math.round((readCount / total) * 100) : 0;

  res.json({
    _id: ch._id, title: ch.title, slug: ch.slug,
    totalPages: total,
    progress: { readCount, total, percent },
    // optional teaser: first page title list
    pageTitles: ch.pages.map(p => ({ idx: p.idx, title: p.title }))
  });
}

// GET /chapters/:slug/page/:idx  (read-only content)
async function getChapterPage(req, res) {
  const ch = await Chapter.findOne({ slug: req.params.slug });
  if (!ch) return res.status(404).json({ error: "Not found" });

  const idx = Number(req.params.idx);
  const page = ch.pages.find(p => p.idx === idx);
  if (!page) return res.status(404).json({ error: "Page not found" });

  res.json({ chapterId: ch._id, idx: page.idx, title: page.title, content: page.content });
}

module.exports = {
  listSubjects, listChapters, getChapter, getQuiz,
  getChapterOverview, getChapterPage
};
