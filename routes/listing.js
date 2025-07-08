const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const {isLoggedIn, isOwner,validateListing,validateReview}=require("../middleware.js");
const flash=require("connect-flash");
const multer  = require("multer")
const {storage}=require("../cloudconfig.js");
// const upload = multer({ dest: 'uploads/' })
// multer pehle local storag mai store kra rha tha ab voh 
// storage mai store krayega cloud storage mai.
const upload = multer({ storage });
const ListingController=require("../controllers/listings.js");
// const validateListing=(req,res,next)=>{
// let {error}=listingSchema.validate(req.body);
// if(error){
//   let errMsg=error.details.map((el)=>el.message.join(","));
//   throw new ExpressError(400,errMsg);
// }
// else{
//   next();
// }
// }

router.route("/")
.get(wrapAsync (ListingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.createListing));
// .post((req,res)=>{
// res.send(req.file);
// });
// Dekh / uploads mai yeh jab gya toh aab iske paas atleast like yeh local 
// storage mai store ho skta hai.

router.get("/new",isLoggedIn,(ListingController.renderNewForm));
router.route("/:id")
.put(isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  isOwner,
wrapAsync(ListingController.updateListing))
.get(wrapAsync(ListingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));


// CREATE ROUTE:
// router.post("/",isLoggedIn,validateListing,wrapAsync(ListingController.createListing));
// // INDEX ROUTE: IT CONTAINS INFO ALL LISTINGS.
// router.get("/",wrapAsync (ListingController.index)); 
// iss route ko pehle rkha hai(/listings/new ko) id vaale sa kyunki voh usse as an 
// id smjhega and usse dhundne ka try krega id mai.
// SHOW ROUTE
// Show up krne ka liye pehle find krana padega 
// router.get("/:id",wrapAsync(ListingController.showListing));
// create route 
// router.post("/",isLoggedIn,wrapAsync(async(req,res,next)=> {
//   const newlisting=new Listing(req.body.listing);
//   await newlisting.save();
//   res.redirect("/listings");
// }));
// EDIT ROUTE
// update route
// router.put("/:id",
//   isLoggedIn,
//   validateListing,
//   isOwner,
//   wrapAsync(ListingController.updateListing));
//destroy route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.deleteListing));


module.exports=router;
