const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  user_name: { type: String, required: true },
  user_level: { type: Number, default: 0 },
  user_bread_prefered: { type: Schema.Types.ObjectId, ref: "Bread", default: null },
  user_bread_total: { type: Number, default: 0 },
  user_bread_consumption: [{
    bread: { type: Schema.Types.ObjectId, ref: "Bread" },
    count: { type: Number, default: 0 }
  }],
  user_color: { type: String, default: "#eec07b" }
}, { collection: "User" });

module.exports = mongoose.model("User", userSchema);