const { Schema, model, Types } = require("mongoose");

const ucpSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", index: true },
  chapterId: { type: Types.ObjectId, ref: "Chapter", index: true },
  readPages: { type: [Number], default: [] },     // unique indices e.g. [0,1,2]
  lastPageIdx: { type: Number, default: 0 },
  updatedAt: { type: Date, default: () => new Date(), index: true }
}, { versionKey: false });

ucpSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

module.exports = model("UserChapterProgress", ucpSchema);
