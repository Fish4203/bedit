var express = require('express');
var router = express.Router();
var jwtAuth = require("../middleware/jwtAuth");

const userController = require("../controllers/userController");


// GET catalog home page.

router.get("/regester", userController.regesterG);
router.post("/regester", userController.regesterP);

router.get("/logout", userController.logout);

router.get("/login", userController.loginG);
router.post("/login", userController.loginP);

router.get("/:id", jwtAuth.verifyToken, userController.profile);

module.exports = router;
