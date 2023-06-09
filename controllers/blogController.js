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
  const otherBlogs = await Blog.find({user: blogResult.user}).exec();
  const users = [];
  for (const comment in commentsResult) {
    users.push(await User.findById(commentsResult[comment].user).exec());
  }
  res.render("pages/blog", {title: blogResult.title, user: req.user, blog: blogResult, blogUser: userResult, otherBlogs: otherBlogs, comments: commentsResult, users: users, errors: [req.query.errors]});
});

// search
exports.blogSearch = asyncHandler(async (req, res, next) => {
  const blogResult = await Blog.find({title: { $regex: req.params.search }}).exec();
  const commentsResult = await Comment.find({body: { $regex: req.params.search }}).exec();
  const userResult = await User.find({username: { $regex: req.params.search }}).exec();

  const blogUsers = [];
  for (const blog in blogResult) {
    blogUsers.push(await User.findById(blogResult[blog].user).exec());
  }
  const commentBlogs = [];
  for (const comment in commentsResult) {
    commentBlogs.push(await Blog.findById(commentsResult[comment].blog).exec());
  }

  res.render("pages/blogSearch", {title: "Search", user: req.user, query: req.params.search, blogs: blogResult, blogUsers: blogUsers, comments: commentsResult, commentBlogs: commentBlogs, users: userResult});
});

// create
exports.blogCreateG = asyncHandler(async (req, res, next) => {
  res.render("pages/blogCreate", {title: "Create a new blog", user: req.user, errors: []});
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
    const errors = validationResult(req).array();

    console.log(req.files);

    if (errors.length == 0) {
      if (req.user != undefined) {
        try {
          const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            user: req.user,
          });

          await blog.save();

          const { image } = req.files;

          if (image != undefined) {
            image.mv(process.cwd() + '/public/images/upload/' + blog._id);
          }
          console.log(process.cwd());
          console.log(image);

          res.redirect(blog.url);
        } catch (e) {
          errors.push("cant create blog");
        }
      } else {
        errors.push("You have to be loged in to create a blog");
      }
    }

    res.render("pages/blogCreate", {title: "Create a new blog", user: req.user, errors: errors});
  }),
];

// delete
exports.blogDeleteG = asyncHandler(async (req, res, next) => {
  try {
    const blogResult = await Blog.findById(req.params.id).exec();
    var url;

    if (String(blogResult.user) == String(req.user._id)) {
      try {
        const fs = require('fs');
        fs.unlinkSync(process.cwd() + '/public/images/upload/' + blogResult._id);
      } catch (e) {}

      await Blog.deleteOne({_id: req.params.id}).exec();
      await Comment.deleteMany({blog: req.params.id}).exec();


      url = '/';
    } else {
      url = '/' + req.params.id + "/?errors=cant delete another users blog";
    }
  } catch (e) {
    url = '/' + req.params.id + "/?errors=cant delete blog";
  }

  res.redirect(url);
});

// update

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
    const errors = validationResult(req).array();
    var url;

    if (errors.length == 0) {
      if (req.user != undefined) {
        try {
          const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            user: req.user,
            _id: req.params.id,
          });

          const blogup = await Blog.findByIdAndUpdate(req.params.id, blog, {});

          url = '/' + req.params.id;
        } catch (e) {
          url = '/' + req.params.id + "/?errors=cant update blog";
        }
      } else {
        url = '/' + req.params.id + "/?errors=You have to be loged in to update a blog";
      }
    } else {
      url = '/' + req.params.id + "/?errors=" + String(errors[0]);
    }

    res.redirect(url);
  }),
];
