var express = require('express');
var router = express.Router();
var jwtAuth = require("../middleware/jwtAuth");


const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");


// GET catalog home page.
router.get("/", jwtAuth.verifyToken, blogController.index);


router.get("/create", jwtAuth.verifyToken, blogController.blogCreateG);
router.post("/create", jwtAuth.verifyToken, blogController.blogCreateP);

router.get("/:id/delete", jwtAuth.verifyToken, blogController.blogDeleteG);

router.post("/:id/update", jwtAuth.verifyToken, blogController.blogUpdateP);

router.post("/:id/comment/create", jwtAuth.verifyToken, commentController.CreateP);

router.get("/:id/comment/:cid/delete", jwtAuth.verifyToken, commentController.DeleteG);

router.post("/:id/comment/:cid/update", jwtAuth.verifyToken, commentController.UpdateP);

router.get("/:id", jwtAuth.verifyToken, blogController.blogDetail);

module.exports = router;
