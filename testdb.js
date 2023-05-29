const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
var bcrypt = require("bcrypt");

const Blog = require("./models/blog");
const Comment = require("./models/comment");
const User = require("./models/user");

const users = [];
const blogs = [];
const comments = [];


main().catch((err) => console.log(err));
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect('mongodb://testa:testa@192.168.20.69:27017');
  console.log("Debug: Should be connected?");
  await createUsers();
  await createBlogs();
  await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function blogCreate(title, body, user) {
  detail = {
    title: title,
    body: body,
    user: user,
  };

  const blog = new Blog(detail);
  await blog.save();
  blogs.push(blog);
  console.log(`Added blog: ${title}`);
}

async function commentCreate(blog, body, user) {
  detail = {
    blog: blog,
    body: body,
    user: user,
  };

  const comment = new Comment(detail);
  await comment.save();
  comments.push(comment);
  console.log(`Added comment: ${body}`);
}

async function userCreate(username, password) {
  detail = {
    username: username,
    password: bcrypt.hashSync(password, 8),
  };

  const user = new User(detail);
  await user.save();
  users.push(user);
  console.log(`Added User: ${username}`);
}


async function createUsers() {
  console.log("Adding blogs");
  await Promise.all([
    userCreate(
      "tree",
      "tree123456",
    ),
    userCreate(
      "foo",
      "foo123456",
    ),
    userCreate(
      "bar",
      "bar123456",
    ),
    userCreate(
      "fish",
      "fish123456",
    ),
  ]);
}

async function testUser() {
  const user = await User.findOne({username: 'trwwwee'}).exec();

  console.log(user);
}


async function createBlogs() {
  console.log("Adding blogs");
  await Promise.all([
    blogCreate(
      "ttttttttttttttttttttttt",
      "idk what to put here but idk",
      users[1],
    ),
    blogCreate(
      "eeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "more stuff to look at ",
      users[1],
    ),
    blogCreate(
      "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      "pirate maxing ",
      users[3],
    ),
    blogCreate(
      "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
      "help i am traped in a website",
      users[2],
    ),
    blogCreate(
      "wwwwwwwwwwwwwwwwwwwwwwww",
      "In Ben ",
      users[2],
    ),
    blogCreate(
      "yyyyyyyyyyyyyyyyyyyyy",
      "Summary of test 1",
      users[0],
    ),
    blogCreate(
      "uuuuuuuuuuuuuuuuuuu",
      "the 2",
      users[0],
    ),
  ]);
}

async function createComments() {
  console.log("Adding comments");
  await Promise.all([
    commentCreate(blogs[0], "big l", users[0],),
    commentCreate(blogs[1], "hi", users[1],),
    commentCreate(blogs[2], "dislike", users[0],),
    commentCreate(
      blogs[3],
      "New",
      users[3],
    ),
    commentCreate(
      blogs[3],
      " Tom ",
      users[2],
    ),
    commentCreate(
      blogs[3],
      " 2016.",
      users[2],
    ),
    commentCreate(
      blogs[4],
      "dsadsadwwdqw",
      users[0],
    ),
    commentCreate(
      blogs[4],
      "help im trapped in a comment",
      users[0],
    ),
    commentCreate(
      blogs[4],
      "caeedfdfsd",
      users[1],
    ),
    commentCreate(blogs[0], "XXX2", users[1],),
    commentCreate(blogs[1], "XXX1", users[1],),
  ]);
}
