const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: { type: String, required: true },
  blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
});

// Virtual for book's URL
// BookSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/catalog/book/${this._id}`;
// });

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
