const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  newRegister,
  newLogin,
  logoutUser,
  loginForm,
  registerForm,
} = require("../controllers/users");

router.route("/register").get(registerForm).post(catchAsync(newRegister));

router
  .route("/login")
  .get(loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    newLogin
  );
router.get("/logout", logoutUser);

module.exports = router;
