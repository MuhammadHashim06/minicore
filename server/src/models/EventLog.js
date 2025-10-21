const { Schema, model, Types } = require("mongoose");
const eventLogSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", index: true },
  type: { type: String, index: true },
  meta: {},
  ts: { type: Date, default: () => new Date(), index: true }
});
module.exports = model("EventLog", eventLogSchema);
