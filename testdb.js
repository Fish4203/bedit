const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Blog = require("./models/blog");
const Comment = require("./models/comment");

const blogs = [];
const comments = [];


main().catch((err) => console.log(err));
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect('mongodb://testa:testa@192.168.20.69:27017');
  console.log("Debug: Should be connected?");
  await createBlogs();
  await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function blogCreate(title, body) {
  detail = {
    title: title,
    body: body,
  };

  const blog = new Blog(detail);
  await blog.save();
  blogs.push(blog);
  console.log(`Added blog: ${title}`);
}

async function commentCreate(blog, body) {
  detail = {
    blog: blog,
    body: body,
  };

  const comment = new Comment(detail);
  await comment.save();
  comments.push(comment);
  console.log(`Added comment: ${body}`);
}



async function createBlogs() {
  console.log("Adding blogs");
  await Promise.all([
    blogCreate(
      "ttttttttttttttttttttttt",
      "idk what to put here but idk",
    ),
    blogCreate(
      "eeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "more stuff to look at ",
    ),
    blogCreate(
      "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      "pirate maxing ",
    ),
    blogCreate(
      "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
      "help i am traped in a website",
    ),
    blogCreate(
      "wwwwwwwwwwwwwwwwwwwwwwww",
      "In Ben ",
    ),
    blogCreate(
      "yyyyyyyyyyyyyyyyyyyyy",
      "Summary of test 1",
    ),
    blogCreate(
      "uuuuuuuuuuuuuuuuuuu",
      "the 2",
    ),
  ]);
}

async function createComments() {
  console.log("Adding comments");
  await Promise.all([
    commentCreate(blogs[0], "big l"),
    commentCreate(blogs[1], "hi"),
    commentCreate(blogs[2], "dislike"),
    commentCreate(
      blogs[3],
      "New",
    ),
    commentCreate(
      blogs[3],
      " Tom ",
    ),
    commentCreate(
      blogs[3],
      " 2016.",
    ),
    commentCreate(
      blogs[4],
      "dsadsadwwdqw",
    ),
    commentCreate(
      blogs[4],
      "help im trapped in a comment",
    ),
    commentCreate(
      blogs[4],
      "caeedfdfsd",
    ),
    commentCreate(blogs[0], "XXX2"),
    commentCreate(blogs[1], "XXX1"),
  ]);
}
