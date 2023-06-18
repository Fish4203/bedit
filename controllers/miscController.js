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
    var url;

    if (errors.isEmpty()) {
      if (req.user != undefined) {
        try {
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
        } catch (e) {
          url = '/' + req.params.id + "/?errors=tag logic error";
        }
      } else {
        url = '/' + req.params.id + "/?errors=You need to login to make a tag";
      }
    } else {
      url = '/' + req.params.id + "/?errors=cant validate input text";
    }

    res.redirect(url);
  }),
];


// search
exports.search = asyncHandler(async (req, res, next) => {
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
