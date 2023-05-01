var express = require('express');
var router = express.Router();
var verifyToken = require("../middleware/jwtAuth");

const userController = require("../controllers/userController");


// GET catalog home page.
router.get("/", verifyToken, userController.profile);

router.get("/regester", userController.regesterG);
router.post("/regester", userController.regesterP);

router.get("/logout", userController.logout);

router.get("/login", userController.loginG);
router.post("/login", userController.loginP);


module.exports = router;
