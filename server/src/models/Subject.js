const { Schema, model } = require("mongoose");
const subjectSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  grade: String,
  order: Number
});
module.exports = model("Subject", subjectSchema);
