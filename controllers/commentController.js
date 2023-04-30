const Blog = require("../models/blog");
const Comment = require("../models/comment");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");


exports.CreateP = [
  // Validate and sanitize fields.
  body("body")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      body: req.body.body,
      blog: req.params.id,
    });

    if (!errors.isEmpty()) {
      const blogResult = await Blog.findById(req.params.id).exec();
      const commentsResult = await Comment.find({blog: req.params.id}).exec();
      res.render("blog", {blog: blogResult, comments: commentsResult, errors: errors.array()});
      return;
    } else {
      const blogResult = await Blog.findById(req.params.id).exec();
      await comment.save();
      res.redirect(blogResult.url);
    }
  }),
];

// delete
exports.DeleteG = asyncHandler(async (req, res, next) => {
  await Comment.deleteOne({_id: req.params.cid}).exec();
  res.redirect('/blogs/' +req.params.id);
});

// update
exports.UpdateG = asyncHandler(async (req, res, next) => {
  const commentsResult = await Comment.findById(req.params.cid).exec();
  res.render("updateComment", {comment: commentsResult, errors: []});
});

exports.UpdateP = [
  // Validate and sanitize fields.
  body("body")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      body: req.body.body,
      blog: req.params.id,
      _id: req.params.cid
    });
    console.log('here');

    if (!errors.isEmpty()) {
      const commentsResult = await Comment.find({blog: req.params.id}).exec();
      res.render("updateComment", {comment: commentsResult, errors: errors.array()});
      return;
    } else {
      const blogResult = await Blog.findById(req.params.id).exec();
      await Comment.findByIdAndUpdate(req.params.cid, comment, {});
      res.redirect(blogResult.url);
    }
  }),
];
