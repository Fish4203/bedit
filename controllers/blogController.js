const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const Tag = require("../models/tag");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

// view
exports.index = asyncHandler(async (req, res, next) => {
  try {
    const successfulResult = await Blog.find({}).exec();
    const users = [];
    for (const blog in successfulResult) {
      users.push(await User.findById(successfulResult[blog].user).exec());
    }
    // const successfulResult = await Blog.findById('644dc6e0f17dbf6c56df034b').exec();
    res.render("pages/blogs", {
      title: "index",
      user: req.user,
      users: users,
      blogs: successfulResult
    });
  } catch (e) {
    res.redirect('/error/?code=500&errors=' + e);
  }
});

exports.blogDetail = asyncHandler(async (req, res, next) => {
  try {
    const blogResult = await Blog.findById(req.params.id).exec();
    const commentsResult = await Comment.find({blog: req.params.id}).exec();
    const userResult = await User.findById(blogResult.user).exec();
    const otherBlogs = await Blog.find({user: blogResult.user}).exec();
    const users = [];
    for (const comment in commentsResult) {
      users.push(await User.findById(commentsResult[comment].user).exec());
    }

    const tagResult = await Tag.find({blog: req.params.id}).exec();

    const tagmap = new Map();

    for (const tag in tagResult) {
      if (tagmap.get(tagResult[tag].body) != undefined) {
        tagmap.set(tagResult[tag].body, tagmap.get(tagResult[tag].body)+1);
      } else {
        tagmap.set(tagResult[tag].body, 1);
      }
    }

    res.render("pages/blog", {
      title: blogResult.title,
      user: req.user,
      blog: blogResult,
      blogUser: userResult,
      otherBlogs: otherBlogs,
      comments: commentsResult,
      users: users,
      tags: tagmap,
      errors: [req.query.errors]
    });
  } catch (e) {
    res.redirect('/error/?code=500&errors=' + e);
  }
});


// create
exports.blogCreateG = asyncHandler(async (req, res, next) => {
  try {
    res.render("pages/blogCreate", {
    title: "Create a new blog",
    user: req.user,
    errors: []
  });
  } catch (e) {
    res.redirect('/error/?code=500&errors=' + e);
  }
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

    if (errors.length == 0) {
      if (req.user != undefined) {
        try {
          const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            user: req.user,
          });

          await blog.save();


          if (req.files != null && 'image' in req.files) {
            const { image } = req.files;

            image.mv(process.cwd() + '/public' + blog.image);
          }

          res.redirect(blog.url);
        } catch (e) {
          console.log(e);
          errors.push("cant create blog");
        }
      } else {
        errors.push("You have to be loged in to create a blog");
      }
    }

    res.render("pages/blogCreate", {
      title: "Create a new blog",
      user: req.user,
      errors: errors
    });
  }),
];

// delete
exports.blogDeleteG = asyncHandler(async (req, res, next) => {
  try {
    const blogResult = await Blog.findById(req.params.id).exec();
    let url = '';

    if (String(blogResult.user._id) == String(req.user._id)) {
      try {
        const fs = require('fs');
        fs.unlinkSync(process.cwd() + '/public' + blogResult.image);
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
    let url = '';

    if (errors.length == 0) {
      if (req.user != undefined) {
        const blogResult = await Blog.findById(req.params.id).exec();
        if (String(req.user._id) == String(blogResult.user._id)) {
          try {
            const blog = new Blog({
              title: req.body.title,
              body: req.body.body,
              user: req.user,
              _id: req.params.id,
            });

            const blogup = await Blog.findByIdAndUpdate(req.params.id, blog, {});


            if (req.files != null && 'image' in req.files) {
              const { image } = req.files;

              try {
                const fs = require('fs');
                fs.unlinkSync(process.cwd() + '/public' + blogup.image);
              } catch (e) {}

              image.mv(process.cwd() + '/public' + blogup.image);
            }


            url = '/' + req.params.id;
          } catch (e) {
            url = '/' + req.params.id + "/?errors=cant update blog";
          }
        } else {
          url = '/' + req.params.id + "/?errors=you dont have permission to update the blog"
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
