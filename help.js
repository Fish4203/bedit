const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
var bcrypt = require("bcrypt");

const Blog = require("./models/blog");
const Comment = require("./models/comment");
const User = require("./models/user");
const Tag = require("./models/tag");

main().catch((err) => console.log(err));
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect('mongodb://blog:fish1234@192.168.20.69:27017/test');
  console.log("Debug: Should be connected?");
  await foo();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}


async function tagmake(body, bid, uid) {
  const tag = new Tag({
    body: body,
    blog: bid,
    user: uid,
  });

  await tag.save();
}

async function foo() {
  console.log("Adding blogs");
  const blog = await Blog.findOne({}).exec();
  const users = await User.find({}).exec();


  await Promise.all([
    tagmake(
      "like",
      blog._id,
      users[2]._id,
    ),
    tagmake(
      "like",
      blog._id,
      users[1]._id,
    ),
    tagmake(
      "fish",
      blog._id,
      users[3]._id,
    ),
    tagmake(
      "tree",
      blog._id,
      users[2]._id,
    ),
    tagmake(
      "fish",
      blog._id,
      users[2]._id,
    ),
    tagmake(
      "like",
      blog._id,
      users[0]._id,
    ),
    tagmake(
      "tree",
      blog._id,
      users[0]._id,
    ),
  ]);
}
