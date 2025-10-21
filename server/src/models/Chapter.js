// const { Schema, model, Types } = require("mongoose");
// const chapterSchema = new Schema({
//   subjectId: { type: Types.ObjectId, ref: "Subject", index: true },
//   title: String,
//   slug: { type: String, unique: true },
//   videoUrl: String,
//   notesHtml: String,
//   order: Number,
//   isActive: { type: Boolean, default: true }
// });
// module.exports = model("Chapter", chapterSchema);


const { Schema, model, Types } = require("mongoose");

const pageSchema = new Schema({
  idx: { type: Number, required: true },        // 0..N-1
  title: { type: String, default: "" },
  // Arbitrary JSON blocks (keep flexible: paragraphs, images, quiz stubs, etc.)
  content: { type: Object, default: {} },
  estSeconds: { type: Number, default: 60 }     // for time-on-task (optional)
}, { _id: false });

const chapterSchema = new Schema({
  subjectId: { type: Types.ObjectId, ref: "Subject", index: true },
  title: String,
  slug: { type: String, unique: true },
  // videoUrl is optional now—can stay for future
  videoUrl: String,
  // REPLACED notesHtml with structured pages
  pages: { type: [pageSchema], default: [] },
  order: Number,
  isActive: { type: Boolean, default: true }
});

module.exports = model("Chapter", chapterSchema);
