var express = require('express');
var router = express.Router();

const blogController = require("../controllers/blogController");
// const commentController = require("../controllers/commentController");


// GET catalog home page.
router.get("/", blogController.index);


router.get("/create", blogController.blogCreateG);
router.post("/create", blogController.blogCreateP);

router.get("/:id/delete", blogController.blogDeleteG);

router.get("/:id/update", blogController.blogUpdateG);
router.post("/:id/update", blogController.blogUpdateP);

router.get("/:id", blogController.blogDetail);

module.exports = router;
