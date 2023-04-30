var express = require('express');
var router = express.Router();

const blogController = require("../controllers/blogController");
// const commentController = require("../controllers/commentController");


// GET catalog home page.
router.get("/", blogController.index);

router.get("/blog/:id", blogController.blogDetail);

router.get("/blog/create", blogController.blogCreateG);
router.post("/blog/create", blogController.blogCreateP);

router.get("/blog/:id/delete", blogController.blogDeleteG);
router.post("/blog/:id/delete", blogController.blogDeleteP);

router.get("/blog/:id/update", blogController.blogUpdateG);
router.post("/blog/:id/update", blogController.blogUpdateP);


module.exports = router;
