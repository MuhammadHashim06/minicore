const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const EventLog = require("../models/EventLog");
const User = require("../models/User");
const { calcLevel, xpDeltaForScore } = require("../utils/level");

async function submitQuiz(req, res) {
  const { chapterId, answers } = req.body || {};
  if (!chapterId || !Array.isArray(answers)) return res.status(400).json({ error: "Bad payload" });

  const ids = answers.map(a => a.qId);
  const qs = await Question.find({ _id: { $in: ids } });
  const map = new Map(qs.map(q => [String(q._id), q]));
  let correct = 0;
  const evaluated = answers.map(a => {
    const q = map.get(a.qId);
    const ok = q && q.answerKey === a.chosen;
    if (ok) correct++;
    return { qId: a.qId, chosen: a.chosen, correct: !!ok };
  });
  const total = answers.length || 1;
  const score = Math.round((correct / total) * 100);

  await EventLog.create({ userId: req.user.id, type: "quiz_submit", meta: { chapterId, score, correct, total }, ts: new Date() });
  const attempt = await QuizAttempt.create({ userId: req.user.id, chapterId, score, correctCount: correct, total, answers: evaluated });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const beforeLevel = user.level;
  const delta = xpDeltaForScore(score);
  user.xp += delta;
  user.level = calcLevel(user.xp);

  const newBadges = [];
  if (!user.badges.includes("first_chapter")) newBadges.push("first_chapter");
  if (score >= 80 && !user.badges.includes("eighty_plus")) newBadges.push("eighty_plus");
  if (newBadges.length) user.badges.push(...newBadges);
  await user.save();

  res.json({ score, correctCount: correct, total, xpDelta: delta, newLevel: user.level > beforeLevel ? user.level : undefined, newBadge: newBadges, attemptId: attempt._id });
}

module.exports = { submitQuiz };
