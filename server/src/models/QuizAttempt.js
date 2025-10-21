const { Schema, model, Types } = require("mongoose");
const quizAttemptSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", index: true },
  chapterId: { type: Types.ObjectId, ref: "Chapter", index: true },
  score: Number,
  correctCount: Number,
  total: Number,
  answers: [{ qId: String, chosen: String, correct: Boolean }]
}, { timestamps: true });
module.exports = model("QuizAttempt", quizAttemptSchema);
