const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const Tag = require("../models/tag");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");




exports.addNRemoveP  = [
  // Validate and sanitize fields.
  body("body")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let url = '/';

    if (errors.isEmpty()) {
      if (req.user != undefined) {
        try {
          console.log("TREE");
          const tagResult = await Tag.findOne({body: req.body.body, blog: req.params.id, user: req.user}).exec();

          if (tagResult != null) {
            await Tag.deleteOne({_id: tagResult._id}).exec();
          } else {
            const tag = new Tag({
              body: req.body.body,
              blog: req.params.id,
              user: req.user,
            });

            await tag.save();
          }

          url = '/' + req.params.id;
          console.log("TREE");
        } catch (e) {
          url = '/' + req.params.id + "/?errors=tag logic error";
        }
      } else {
        url = '/' + req.params.id + "/?errors=You need to login to make a tag";
      }
    } else {
      url = '/' + req.params.id + "/?errors=cant validate input text";
    }

    console.log("out");
    res.redirect(url);
  }),
];


// search
exports.search = asyncHandler(async (req, res, next) => {
  try {
    const blogResult = await Blog.find({title: { $regex: req.params.search }}).exec();
    const commentsResult = await Comment.find({body: { $regex: req.params.search }}).exec();
    const userResult = await User.find({username: { $regex: req.params.search }}).exec();
    const tagResult = await Tag.find({body: { $regex: req.params.search }}).exec();

    const blogUsers = [];
    for (const blog in blogResult) {
      blogUsers.push(await User.findById(blogResult[blog].user).exec());
    }
    const commentBlogs = [];
    for (const comment in commentsResult) {
      commentBlogs.push(await Blog.findById(commentsResult[comment].blog).exec());
    }

    const tagBlogs = [];
    for (const tag in tagResult) {
      tagBlogs.push(await Blog.findById(tagResult[tag].blog).exec());
    }

    res.render("pages/blogSearch", {
      title: "Search",
      user: req.user,
      query: req.params.search,
      blogs: blogResult,
      blogUsers: blogUsers,
      comments: commentsResult,
      commentBlogs: commentBlogs,
      tags: tagResult,
      tagBlogs: tagBlogs,
      users: userResult
    });
  } catch (e) {
    res.redirect('/error/?code=500&errors=' + e);
  }
});

// error
exports.error = asyncHandler(async (req, res, next) => {
  if (req.query.code == '404') {
    res.status(404);
  } else {
    res.status(500);
  }
  res.render("pages/blog", {
    title: 'Error',
    user: undefined,
    errorCode: req.query.code,
    errors: [req.query.errors]
  });
});
