const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.js");
const wrapAsync = require("../utils/wrapAsync");
router.route("/")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));
module.exports = router;