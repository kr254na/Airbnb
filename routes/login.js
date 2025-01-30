const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const userController = require("../controllers/users.js");
const { saveRedirectUrl } = require('../middleware.js');
router.route("/")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",
        { failureRedirect: "/login", failureFlash: true }),
    wrapAsync(userController.login));
module.exports = router;