var express = require('express');
var router = express.Router();
var middleware = require("../middleware/middleware");


const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const miscController = require("../controllers/miscController")

// home page
router.get("/", middleware.verifyToken, blogController.index);

// search the site
router.get("/search/:search", middleware.verifyToken, miscController.search);
router.get("/error", miscController.error);

// blog CUD
router.get("/create", middleware.verifyToken, blogController.blogCreateG);
router.post("/create", middleware.verifyToken, blogController.blogCreateP);
router.get("/:id/delete", middleware.verifyToken, blogController.blogDeleteG);
router.post("/:id/update", middleware.verifyToken, blogController.blogUpdateP);

// comment CUD
router.post("/:id/comment/create", middleware.verifyToken, commentController.CreateP);
router.get("/:id/comment/:cid/delete", middleware.verifyToken, commentController.DeleteG);
router.post("/:id/comment/:cid/update", middleware.verifyToken, commentController.UpdateP);

// tag CD
router.post("/:id/tag", middleware.verifyToken, miscController.addNRemoveP);

// blog R
router.get("/:id", middleware.verifyToken, blogController.blogDetail);

module.exports = router;
