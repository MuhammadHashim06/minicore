const { Schema, model, Types } = require("mongoose");
const questionSchema = new Schema({
  chapterId: { type: Types.ObjectId, ref: "Chapter", index: true },
  stem: String,
  options: [{ key: String, text: String }],
  answerKey: String,
  explanation: String
});
module.exports = model("Question", questionSchema);
