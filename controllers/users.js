const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");

module.exports.signUp=(async(req,res)=>{
    // why used try-catch when used wrpAsync??
// If used wrap-async 
    try{
let {username,email,password}=req.body;
const newUser=new User({email,username});
const registeredUser=await User.register(newUser,password);
console.log(registeredUser);
req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    else{
req.flash("success","Welcome to wanderlust"); 
res.redirect("/listings");
    }
})
// jaise hee db ka andar info store hojaye vaise hee
// login krva doh
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});


module.exports.logOut=(req,res)=>{
  req.logOut((err)=>{
    if(err){
     return next(err);
    }
    req.flash("success","you are logged out");
    res.redirect("/listings");
  });
};

module.exports.logIn=(async(req,res)=>{
        // ak baar passport nah success dediya req.session ki saari info reset hohojayegi 
        // therefore using req.session.rediredUrl will show undefined
        // therfore use locals.
req.flash("success","Welcome to wanderlust your are logged in"); 
let redirectUrl=res.locals.redirectUrl||"/listings";
res.redirect(redirectUrl);
});

module.exports.renderSignupform=(req,res)=>{
res.render("users/signup.ejs");
};

module.exports.renderLoginForm=(async(req,res)=>{
res.render("users/login.ejs");
});