const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Basic", "Admin"],
    default: "Basic",
    required: true,
  },
});


// Virtual for blogs URL
UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
