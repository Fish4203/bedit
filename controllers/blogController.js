const Blog = require("../models/blog");
const asyncHandler = require('express-async-handler')

// view
exports.index = asyncHandler(async (req, res, next) => {
  const successfulResult = await Blog.find({}).exec();
  res.render("blogs", { title: "index", blogs: successfulResult });
});

exports.blogDetail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
});

// create
exports.blogCreateG = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create GET");
});

exports.blogCreateP = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create POST");
});

// delete
exports.blogDeleteG = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

exports.blogDeleteP = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
});

// update
exports.blogUpdateG = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

exports.blogUpdateP = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
