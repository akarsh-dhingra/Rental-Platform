let port=8180;

const express=require("express");
const app=express();
const Listing=require("./models/listing.js");
const mongoose = require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set('views', path.join(__dirname, 'views'));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.get("/",(req,res)=>{
    res.send("Root path is working");
})

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
console.log("connected"); 
})
.catch(()=>console.log("Not conntected"));

app.get("/testlisting",async(req,res)=>{
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
});

// INDEX ROUTE: IT CONTAINS INFO ALL LISTINGS.
app.get("/listings", async (req,res)=>{
  let alllistings=await Listing.find({})
res.render("listings/index",{alllistings});
}); 
// iss route ko pehle rkha hai(/listings/new ko) id vaale sa kyunki voh usse as an 
// id smjhega and usse dhundne ka try krega id mai.
app.get("/listings/new",async(req,res)=>{
res.render("listings/new");
});
// SHOW ROUTE
// Show up krne ka liye pehle find krana padega 
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id)
  res.render("listings/show",{listing});
});
// create route 
app.post("/listings",async (req,res)=>{
  //  let{title,description,image,price,location,country}=req.body;
  const newlisting=new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});
// UPDATE ROUTE
app.get("/listings/:id/edit",async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit",{listing});
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, price, location, country } = req.body.listing;

  const updatedListing = {
    title,
    description,
    image: {
      url: image,
      filename: ""  // optional, or generate from image URL
    },
    price,
    location,
    country
  };

  await Listing.findByIdAndUpdate(id, updatedListing);
  res.redirect("/listings");
});



app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  let deletedlisting=await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings");
});
app.listen(port,(req,res)=>{
console.log(`Listening to ${port} right now`);
});
