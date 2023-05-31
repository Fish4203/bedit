const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

// view
exports.index = asyncHandler(async (req, res, next) => {
  const successfulResult = await Blog.find({}).exec();
  const users = [];
  for (const blog in successfulResult) {
    users.push(await User.findById(successfulResult[blog].user).exec());
  }
  // const successfulResult = await Blog.findById('644dc6e0f17dbf6c56df034b').exec();
  res.render("pages/blogs", { title: "index", user: req.user, users: users, blogs: successfulResult });
});

exports.blogDetail = asyncHandler(async (req, res, next) => {
  const blogResult = await Blog.findById(req.params.id).exec();
  const commentsResult = await Comment.find({blog: req.params.id}).exec();
  const userResult = await User.findById(blogResult.user).exec();
  const users = [];
  for (const comment in commentsResult) {
    users.push(await User.findById(commentsResult[comment].user).exec());
  }
  console.log(req.user);
  console.log("t");
  res.render("pages/blog", {title: "the", user: req.user, blog: blogResult, blogUser: userResult, comments: commentsResult, users: users, errors: []});
});

// create
exports.blogCreateG = asyncHandler(async (req, res, next) => {
  res.render("newBlog", {user: req.user, errors: []});
});

exports.blogCreateP = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("body")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const blog = new Blog({
      title: req.body.title,
      body: req.body.body,
    });

    if (!errors.isEmpty()) {
      res.render("newBlog", {user: req.user, errors: errors.array()});
      return;
    } else {
      await blog.save();
      res.redirect(blog.url);
    }
  }),
];

// delete
exports.blogDeleteG = asyncHandler(async (req, res, next) => {
  await Blog.deleteOne({_id: req.params.id}).exec();
  await Comment.deleteMany({blog: req.params.id}).exec();
  res.redirect('/blogs');
});

// update
exports.blogUpdateG = asyncHandler(async (req, res, next) => {
  const blogResult = await Blog.findById(req.params.id).exec();
  res.render("updateBlog", {user: req.user, blog: blogResult, errors: []});
});

exports.blogUpdateP = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("body")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const blog = new Blog({
      title: req.body.title,
      body: req.body.body,
      _id: req.params.id,
    });



    if (!errors.isEmpty()) {
      const blogResult = await Blog.findById(req.params.id).exec();
      res.render("updateBlog", {user: req.user, blog: blogResult, errors: errors.array()});
      return;
    } else {
      const blogup = await Blog.findByIdAndUpdate(req.params.id, blog, {});
      res.redirect(blogup.url);
    }
  }),
];
