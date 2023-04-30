const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, required: true},
  status: {
    type: String,
    required: true,
    enum: ["Public", "Private", "Archived"],
    default: "Public",
  },
});


// Virtual for blogs URL
BlogSchema.virtual("url").get(function () {
  return `/blogs/blog/${this._id}`;
});

// Export model
module.exports = mongoose.model("Blog", BlogSchema);
