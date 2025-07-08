const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const {isLoggedIn, isOwner,validateListing,validateReview}=require("../middleware.js");
const flash=require("connect-flash");

module.exports.createReview=(async(req,res)=>{
// sbse pehle id ko find krlete hai
let listing=await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);
newReview.author=req.user._id;
console.log(newReview);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
console.log("new review saved");
req.flash("success","New review Created!");
res.redirect(`/listings/${listing._id}`);
});

module.exports.deletereview=(async(req,res)=>{
 let {id,reviewId}=req.params;
 await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
 await Review.findByIdAndDelete(reviewId);
 req.flash("success","Review Deleted!");
 res.redirect(`/listings/${id}`);
});