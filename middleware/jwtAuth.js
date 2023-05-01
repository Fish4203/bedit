const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')

User = require("../models/user");

exports.verifyToken = asyncHandler(async (req, res, next) => {

  if ('accessToken' in req.cookies) {
    jwt.verify(req.cookies['accessToken'], process.env.API_SECRET, asyncHandler(async (err, decoded) => {
      var id = decoded.id;
      // console.log(id);
      const user = await User.findById(id).exec();
      // console.log(id);
      if (user == null) {
        next();
      } else {
        req.user = user;
        next();
      }
    }));
  } else {
    req.user = undefined;
    next();
  }
});
