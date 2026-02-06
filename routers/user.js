const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js");

// Signup Routes
router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.signup));

// Login Routes
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersController.login,
  );

// Logout Route
router.get("/logout", usersController.logout);

module.exports = router;
