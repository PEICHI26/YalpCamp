const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {newRegister,newLogin,logoutUser,loginForm, registerForm} = require("../controllers/users");

router.get("/register", registerForm);
router.post("/register", catchAsync(newRegister));
router.get("/login", loginForm);
router.post("/login",passport.authenticate("local", {failureFlash: true,failureRedirect: "/login",}),newLogin);
router.get("/logout", logoutUser);

module.exports = router;
