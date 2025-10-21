const EventLog = require("../models/EventLog");
const Chapter  = require("../models/Chapter");
const Subject  = require("../models/Subject");
const UCP      = require("../models/UserChapterProgress");
const dayjs    = require("dayjs");

async function todayProgress(req, res) {
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();
  const logs = await EventLog.find({ userId: req.user.id, ts: { $gte: start, $lte: end } });
  const questionsAnswered = logs.filter(l => l.type === "question_answer").length;
  const quizSubmits = logs.filter(l => l.type === "quiz_submit");
  const pointsEarned = quizSubmits.reduce((s, l) => s + ((l.meta?.score || 0) >= 60 ? 10 : 5), 0);
  res.json({ questionsAnswered, pointsEarned });
}
async function weeklyProgress(req, res) {
  const start = dayjs().subtract(6, "day").startOf("day").toDate();
  const logs = await EventLog.find({ userId: req.user.id, ts: { $gte: start } }).sort({ ts: 1 });
  const byDate = {};
  logs.forEach(l => {
    const key = dayjs(l.ts).format("YYYY-MM-DD");
    byDate[key] ??= { questionsAnswered: 0, pointsEarned: 0 };
    if (l.type === "question_answer") byDate[key].questionsAnswered++;
    if (l.type === "quiz_submit") byDate[key].pointsEarned += (l.meta?.score || 0) >= 60 ? 10 : 5;
  });
  res.json({ days: byDate });
}
async function recentAchievements(req, res) {
  const last = await EventLog.findOne({ userId: req.user.id, type: "quiz_submit" }).sort({ ts: -1 });
  res.json({ recent: last?.meta || null });
}
// POST /progress/page-read { chapterId, pageIdx }
async function pageRead(req, res) {
  const { chapterId, pageIdx } = req.body || {};
  if (!chapterId || pageIdx === undefined) return res.status(400).json({ error: "Bad payload" });

  const ch = await Chapter.findById(chapterId).lean();
  if (!ch) return res.status(404).json({ error: "Chapter not found" });
  const total = ch.pages.length;

  const ucp = await UCP.findOneAndUpdate(
    { userId: req.user.id, chapterId },
    {
      $addToSet: { readPages: Number(pageIdx) },
      $set: { lastPageIdx: Number(pageIdx), updatedAt: new Date() }
    },
    { upsert: true, new: true }
  );

  await EventLog.create({
    userId: req.user.id, type: "page_view",
    meta: { chapterId, pageIdx }, ts: new Date()
  });

  const readCount = ucp.readPages.length;
  const percent = total ? Math.round((readCount / total) * 100) : 0;
  res.json({ ok: true, readCount, total, percent });
}

// GET /progress/chapters   -> per chapter percent for current grade
async function chaptersProgress(req, res) {
  const subjects = await Subject.find({ grade: req.user.grade }).select("_id slug title").lean();
  const subIds = subjects.map(s => s._id);

  const chapters = await Chapter.find({ subjectId: { $in: subIds }, isActive: true })
    .select("_id title slug subjectId pages").lean();

  const ucp = await UCP.find({ userId: req.user.id, chapterId: { $in: chapters.map(c => c._id) } }).lean();
  const progressMap = new Map(ucp.map(x => [String(x.chapterId), x]));

  const result = chapters.map(c => {
    const p = progressMap.get(String(c._id));
    const read = p?.readPages?.length || 0;
    const total = c.pages?.length || 0;
    const percent = total ? Math.round((read/total)*100) : 0;
    return {
      chapterId: c._id, chapterSlug: c.slug, chapterTitle: c.title,
      subjectId: c.subjectId, totalPages: total, readPages: read, percent
    };
  });

  res.json(result);
}

// GET /progress/subjects   -> roll-up by subject
async function subjectsProgress(req, res) {
  const subjects = await Subject.find({ grade: req.user.grade }).select("_id slug title").lean();
  const subIds = subjects.map(s => s._id);
  const chapters = await Chapter.find({ subjectId: { $in: subIds }, isActive: true })
    .select("_id subjectId pages").lean();

  const ucp = await UCP.find({ userId: req.user.id }).select("chapterId readPages").lean();
  const ucpMap = new Map(ucp.map(x => [String(x.chapterId), x.readPages?.length || 0]));

  // aggregate per subject
  const bySub = new Map(); // subId -> { totalPages, readPages }
  for (const ch of chapters) {
    const total = ch.pages?.length || 0;
    const read = ucpMap.get(String(ch._id)) || 0;
    const curr = bySub.get(String(ch.subjectId)) || { totalPages: 0, readPages: 0 };
    curr.totalPages += total;
    curr.readPages  += Math.min(read, total);
    bySub.set(String(ch.subjectId), curr);
  }

  const result = subjects.map(s => {
    const agg = bySub.get(String(s._id)) || { totalPages: 0, readPages: 0 };
    const percent = agg.totalPages ? Math.round((agg.readPages/agg.totalPages)*100) : 0;
    return { subjectId: s._id, subjectSlug: s.slug, subjectTitle: s.title, ...agg, percent };
  });

  res.json(result);
}

module.exports = {
  todayProgress, weeklyProgress, recentAchievements,
  pageRead, chaptersProgress, subjectsProgress
};