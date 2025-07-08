const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const {isLoggedIn, isOwner,validateListing,validateReview}=require("../middleware.js");
const flash=require("connect-flash");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const { response } = require("express");
const maptoken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:maptoken});

module.exports.index=(async (req,res)=>{
  let alllistings=await Listing.find({})
  res.render("listings/index",{alllistings});
});


module.exports.renderNewForm=(async(req,res)=>{
res.render("listings/new");
});

module.exports.showListing=(async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author",
    },
  })
  .populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show",{listing});
});
module.exports.createListing=(async(req,res,next)=>{
 let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
//   let result=listingSchema.validate(req.body);
//   console.log(result);
let url= req.file.path;
let filename=req.file.filename;
const newlisting= new Listing(req.body.listing);
newlisting.geometry=response.body.features[0].geometry;
//   console.log(req.user);
  newlisting.owner=req.user._id;  // let's print req.user
  newlisting.image={filename,url};
 let savelisting= await newlisting.save();
 console.log(savelisting);
  req.flash("success","New listing Created!");
  res.redirect("/listings");
});

module.exports.renderEditForm=(async(req,res)=>{
  let{id}=req.params;
  const listing=await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
  }
 let originalImageUrl=listing.image.url.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs",{listing,originalImageUrl});
});

module.exports.updateListing=(async (req, res) => {


const newlisting= new Listing(req.body.listing);
  const { id } = req.params;
  // const { title, description, image, price, location, country } = req.body.listing;
  // const updatedListing = {
  //   title,
  //   description,
  //   image: {
  //     filename: "",
  //     url:image
  //   },
  //   price,
  //   location,
  //   country
  // };
 let listing= await Listing.findByIdAndUpdate( id, {...req.body.listing});
 if(typeof req.file !="undefined"){
let url= req.file.path;
let filename=req.file.filename;
listing.image={filename,url};
await listing.save();
 }
  req.flash("success","Listing Updated!");
  res.redirect("/listings");
});

module.exports.deleteListing=(async(req,res)=>{
  let {id}=req.params;
  let deletedlisting=await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  // req.flash("success","Listing Deleted!");
  res.redirect("/listings");
});