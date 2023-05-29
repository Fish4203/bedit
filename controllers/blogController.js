const Blog = require("../models/blog");
const Comment = require("../models/comment");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

// view
exports.index = asyncHandler(async (req, res, next) => {
  const successfulResult = await Blog.find({}).exec();
  // const successfulResult = await Blog.findById('644dc6e0f17dbf6c56df034b').exec();
  res.render("pages/blogs", { title: "index", blogs: successfulResult });
});

exports.blogDetail = asyncHandler(async (req, res, next) => {
  const blogResult = await Blog.findById(req.params.id).exec();
  const commentsResult = await Comment.find({blog: req.params.id}).exec();
  res.render("blog", {blog: blogResult, comments: commentsResult, errors: []});
});

// create
exports.blogCreateG = asyncHandler(async (req, res, next) => {
  res.render("newBlog", {errors: []});
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
      res.render("newBlog", {errors: errors.array()});
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
  res.render("updateBlog", {blog: blogResult, errors: []});
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
      res.render("updateBlog", {blog: blogResult, errors: errors.array()});
      return;
    } else {
      const blogup = await Blog.findByIdAndUpdate(req.params.id, blog, {});
      res.redirect(blogup.url);
    }
  }),
];
