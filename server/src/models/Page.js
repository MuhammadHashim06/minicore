const { Schema, model } = require("mongoose");

const pageSchema = new Schema({
  idx: { type: Number, required: true },        // 0..N-1
  title: { type: String, default: "" },
  content: { type: Object, default: {} },       // Content can be arbitrary JSON
  estSeconds: { type: Number, default: 60 }     // Estimated time on task for this page
}, { _id: false });

module.exports = model("Page", pageSchema);
