const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

// view
exports.profile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    const blogResult = await Blog.find({user: user._id}).exec();
    const commentsResult = await Comment.find({user: user._id}).exec();

    const commentBlogs = [];
    for (const comment in commentsResult) {
      commentBlogs.push(await Blog.findById(commentsResult[comment].blog).exec());
    }
    res.render("pages/profile", {
      title: 'User profile',
      user: req.user,
      profile: user,
      blogs: blogResult,
      comments: commentsResult,
      commentBlogs: commentBlogs,
      errors: [req.query.errors]
    });
  } catch (e) {
    res.redirect('/error/?code=500&errors=' + e);
  }
});

// create
exports.registerG = asyncHandler(async (req, res, next) => {
  res.render("pages/register", {title: 'make a new user', user: req.user, errors: []});
});

exports.registerP = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length == 0) {
      try {
        const user = new User({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
        });

        await user.save();

        if (req.files != null && 'image' in req.files) {
          const { image } = req.files;

          image.mv(process.cwd() + '/public' + user.image);
        }

        res.redirect(user.url);
      } catch (e) {
        console.log(e);
        errors.push("Server error can't create user")
      }
    } else {
      errors.push("your password and username need to be at least 6 characters long")
    }

    res.render("pages/register", {title: 'make a new user', user: req.user, errors: errors});
  }),
];

// delete
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('accessToken', '')
  res.redirect('/');
});


exports.loginG = asyncHandler(async (req, res, next) => {
  res.render("pages/login", {title: 'Login', user: undefined, errors: []});
});

exports.loginP = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = await User.findOne({username: req.body.username}).exec();

    if (!errors.isEmpty()) {
      res.render("pages/login", {title: 'Login', user: undefined, errors: errors.array()});
      console.log(errors.array()[0].msg);
      return;
    } else if (user == null) {
      res.render("pages/login", {title: 'Login', user: undefined, errors: ['Cant find user']});
      return;
    } else if (bcrypt.compareSync(req.body.password, user.password)) {

      var token = jwt.sign({
        id: user.id
      }, process.env.API_SECRET, {
        expiresIn: 86400
      });
      res.cookie('accessToken', token)

      res.redirect('/');
    } else {
      res.render("pages/login", {title: 'Login', user: undefined, errors: ['Wrong password']});
      return;
    }
  }),
];

// delete
exports.userDeleteG = asyncHandler(async (req, res, next) => {
  try {
    const blogResult = await Blog.find({user: req.user._id}).exec();

    for (const blog in blogResult) {
      await Comment.deleteMany({blog: blogResult._id}).exec();
    }

    await Comment.deleteMany({user: req.user._id}).exec();
    await Blog.deleteMany({user: req.user._id}).exec();
    await User.deleteOne({_id: req.user._id}).exec();

    res.redirect('/');
  } catch (e) {
    res.redirect('/error/?code=500&errors=' + e);
  }

});


// update
exports.userUpdateP = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("password_new")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    let url = '';

    if (errors.length == 0) {
      if (req.user != undefined) {
        if (String(req.user._id) == req.params.id) {
          const userold = await User.findOne({username: req.body.username}).exec();

          if (bcrypt.compareSync(req.body.password, userold.password)) {
            try {
              const user = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password_new, 8),
                _id: req.params.id,
              });

              const userup = await User.findByIdAndUpdate(req.params.id, user, {});


              if (req.files != null && 'image' in req.files) {
                const { image } = req.files;

                try {
                  const fs = require('fs');
                  fs.unlinkSync(process.cwd() + '/public' + userup.image);
                } catch (e) {}

                image.mv(process.cwd() + '/public' + userup.image);
              }


              url = '/users/' + req.params.id;

            } catch (e) {
              url = '/users/' + req.params.id + "/?errors=cant update user";
            }
          } else {
            url = '/users/' + req.params.id + "/?errors=password is wrong";
          }
        } else {
          url = '/users/' + req.params.id + "/?errors=you dont have permission to update this profile"
        }
      } else {
        url = '/users/' + req.params.id + "/?errors=You have to be loged in to update this profile";
      }
    } else {
      url = '/users/' + req.params.id + "/?errors=" + String(errors[0]);
    }

    res.redirect(url);
  }),
];
