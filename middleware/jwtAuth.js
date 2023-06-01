const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler')

User = require("../models/user");

exports.verifyToken = asyncHandler(async (req, res, next) => {

  if ('accessToken' in req.cookies) {
    jwt.verify(req.cookies['accessToken'], process.env.API_SECRET, asyncHandler(async (err, decoded) => {

      try {
        var id = decoded.id;
        // console.log(id);
        const user = await User.findById(id).exec();
        // console.log(id);
        if (user == null) {
          req.user = undefined;
          next();
        } else {
          req.user = user;
          next();
        }
      } catch (e) {
        req.user = undefined;
        next();
      }
    }));
  } else {
    req.user = undefined;
    next();
  }
});
