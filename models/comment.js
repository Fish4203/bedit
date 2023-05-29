const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: { type: String, required: true },
  blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});


// Export model
module.exports = mongoose.model("Comment", CommentSchema);
