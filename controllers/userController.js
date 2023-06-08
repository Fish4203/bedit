const User = require("../models/user");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

// view
exports.profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  res.render("profile", {user: user });
});

// create
exports.regesterG = asyncHandler(async (req, res, next) => {
  res.render("newUser", {errors: []});
});

exports.regesterP = [
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

    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    if (!errors.isEmpty()) {
      res.render("newUser", {errors: errors.array()});
      return;
    } else {
      await user.save();
      res.redirect(user.url);
    }
  }),
];

// delete
exports.logout = asyncHandler(async (req, res, next) => {
  res.redirect('/');
});


exports.loginG = asyncHandler(async (req, res, next) => {
  res.render("login", {errors: []});
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
      res.render("login", {errors: errors.array()});
      return;
    } else if (user == null) {
      res.render("login", {errors: ['Cant find user']});
      return;
    } else if (bcrypt.compareSync(req.body.password, user.password)) {

      var token = jwt.sign({
        id: user.id
      }, process.env.API_SECRET, {
        expiresIn: 86400
      });
      res.cookie('accessToken', token)

      res.redirect('/users');
    } else {
      res.render("login", {errors: ['Wrong password']});
      return;
    }
  }),
];
