if(process.env.NODE_ENV!="production"){
 require("dotenv").config();
}
// console.log(process.env.CLOUD_API_KEY);
// development phase->project bna rha hu
// deploymnet/production phase -> jisme prject deploy hota hai use kr rha hu

let port=8180;

const express=require("express");
const app=express();
const Listing=require("./models/listing.js");
const mongoose = require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const MongoStore = require('connect-mongo');
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");

const Review=require("./models/reviews.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const User=require("./models/user.js");



app.set('views', path.join(__dirname, 'views'));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in mongo Session store",err);
});

const sessionoptions={
store,
secret:process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
expires:Date.now()+7*24*60*60*1000,
maxAge:7*24*60*60*1000,
httponly:true
}
};

app.get("/",(req,res)=>{
    res.send("Root path is working");
});

app.use(session(sessionoptions));
app.use(flash());
// passport humesha session ko bhi use krega  
// we are going to use passport.initialize as a middlewaree
app.use(passport.initialize());
app.use(passport.session());
// aak session ka andar user ak hee baar sign in kre.
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// jitne bhi users  aaye voh ak localStrategy ka through authenticate hone chahiye 

app.get("/demouser",async(req,res)=>{
  // Creation
let fakeUser=new User({
email:"student@gmail.com",
username:"Akarsh-student",
});
// Register krvaya hai!
let newUser=await User.register(fakeUser,"helloworld");
res.send(newUser);
});

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

//pehle flash aayega fir routes aayenge.

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);
// Id aage reviews mai nahh jaane ka reason hai ki joh / sa pehle vaala content hai 
// voh aage jaah nahi paa rha kyunki aage sirf / ka aage vaala jaata hai means /listings/:id/reviews/ iska aage joh hoga voh jayega

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
// ;
async function main() {
  await mongoose.connect(process.env.ATLASDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
});
}
// console.log("→ ATLASDB_URL =", JSON.stringify(process.env.ATLASDB_URL));


main()
.then(()=>{
console.log("connected"); 
})
.catch((err)=>console.log("Not connected",err));

// app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
//   let result=listingSchema.validate(req.body);
//   console.log(result);
//   const newlisting= new Listing(req.body.listing);
//   await newlisting.save();
//   res.redirect("/listings");
// }));


app.get("/testlisting",wrapAsync(async(req,res)=>{
let slisting=new Listing({
  title:"The new Villa",
  description:"By the beach",
  price:1200,
      image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
  location:"Calangute,Goa",
  country:"India"
});
await slisting.save();
console.log("Sample was Saved");
res.send("succesful saving");
}));

// INDEX ROUTE: IT CONTAINS INFO ALL LISTINGS.
// app.get("/listings", wrapAsync(async (req,res)=>{
//   let alllistings=await Listing.find({})
//   res.render("listings/index",{alllistings});
// })); 
// iss route ko pehle rkha hai(/listings/new ko) id vaale sa kyunki voh usse as an 
// id smjhega and usse dhundne ka try krega id mai.
// app.get("/listings/new",async(req,res)=>{
// res.render("listings/new");
// });
// SHOW ROUTE
// Show up krne ka liye pehle find krana padega 
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   const listing=await Listing.findById(id).populate("reviews");
//   res.render("listings/show",{listing});
// }));
// create route 
// app.post("/listings",wrapAsync(async(req,res,next)=> {
//   const newlisting=new Listing(req.body.listing);
//   await newlisting.save();
//   res.redirect("/listings");
// }));
// UPDATE ROUTE
// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//   let{id}=req.params;
//   const listing=await Listing.findById(id);
//   res.render("listings/edit.ejs",{listing});
// }));

// app.put("/listings/:id",wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   const { title, description, image, price, location, country } = req.body.listing;

//   const updatedListing = {
//     title,
//     description,
//     image: {
//       url: image,
//       filename: ""  // optional, or generate from image URL
//     },
//     price,
//     location,
//     country
//   };
//   await Listing.findByIdAndUpdate(id, updatedListing);
//   res.redirect("/listings");
// }));
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
//   let deletedlisting=await Listing.findByIdAndDelete(id);
//   console.log(deletedlisting);
//   res.redirect("/listings");
// }));

// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
// // sbse pehle id ko find krlete hai
// let listing=await Listing.findById(req.params.id);
// let newReview=new Review(req.body.review);
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();
// console.log("new review saved");
// res.redirect(`/listings/${listing._id}`);
// }));

// app.use((err,req,res,next)=>{
//    res.send("Something Went Wrong!");
// });


// agr upar kisi ka saath match krna hoga toh to krgya hoga nahi toh nahi kra hoga


// app.all("*",(req,res,next)=>{
// next(new ExpressError(404,"Page not Found"));
// });

// Delete review route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//  let {id,reviewId}=req.params;
//  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//  await Review.findByIdAndDelete(reviewId);
//  res.redirect(`/listings/${id}`)
// }));

// $pull operator removes from an existing array all instances 
// of a value or values that match a specified condition.

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).render("listings/errors.ejs",{err});
//   // res.status(statusCode).send(message);
// });

// All those errors which depend on the individual field
// and not on the request as a whole unhe check krna hai 
app.listen(port, () => {
  console.log(`Listening to ${port} right now`);
});

