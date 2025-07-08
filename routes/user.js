const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");
const UserController=require("../controllers/users.js");

router.route("/signup")
.get(UserController.renderSignupform)
.post(wrapAsync(UserController.signUp));

router.route("/login")
.get(wrapAsync(UserController.renderLoginForm))
.post(saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:'/login',failureFlash:true}) 
    ,UserController.logIn);

// router.get("/signup",UserController.renderSignupform);
// router.post("/signup",wrapAsync(UserController.signUp));
// router.get("/login",wrapAsync(UserController.renderLoginForm));
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",
//     {failureRedirect:'/login',failureFlash:true}) 
//     ,UserController.logIn);
router.get("/logout",UserController.logOut);
module.exports=router;