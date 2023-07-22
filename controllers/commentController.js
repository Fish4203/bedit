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
    let url = '';

    if (errors.isEmpty()) {
      if (req.user != undefined) {
        try {
          const comment = new Comment({
            body: req.body.body,
            blog: req.params.id,
            user: req.user,
          });

          await comment.save();

          url = '/' + req.params.id;
        } catch (e) {
          url = '/' + req.params.id + "/?errors=cant create comment";
        }
      } else {
        url = '/' + req.params.id + "/?errors=You need to login to make a comment";
      }
    } else {
      url = '/' + req.params.id + "/?errors=cant validate input text";
    }

    res.redirect(url);
  }),
];

// delete
exports.DeleteG = asyncHandler(async (req, res, next) => {
  let url = '';
  try {
    const commentsResult = await Comment.findById(req.params.cid).exec();

    if (String(commentsResult.user._id) == String(req.user._id)) {
      await Comment.deleteOne({_id: req.params.cid}).exec();
      url = '/' + req.params.id;
    } else {
      url = '/' + req.params.id + "/?errors=cant delete another users comments";
    }
  } catch (e) {
    url = '/' + req.params.id + "/?errors=cant delete comment";
  }

  res.redirect(url);
});

// update

exports.UpdateP = [
  // Validate and sanitize fields.
  body("body")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // do the stuff
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let url = '';

    if (errors.isEmpty()) {
      try {
        const commentsResult = await Comment.findById(req.params.cid).exec();

        if (String(commentsResult.user._id) == String(req.user._id)) {
          const comment = new Comment({
            body: req.body.body,
            blog: req.params.id,
            _id: req.params.cid
          });
          await Comment.findByIdAndUpdate(req.params.cid, comment, {});

          url = '/' + req.params.id;
        } else {
          url = '/' + req.params.id + "/comment/" + req.params.cid + "/update" + "/?errors=Cant update another users comments";
        }
      } catch (e) {
        url = '/' + req.params.id + "/comment/" + req.params.cid + "/update" + "/?errors=Cant update comment";
      }
    } else {
      url = '/' + req.params.id + "/comment/" + req.params.cid + "/update" + "/?errors=Cant validate input text";
    }

    res.redirect(url);
  }),
];
