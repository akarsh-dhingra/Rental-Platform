const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to Db");
})
.catch((err)=>console.log("ERROR"));

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({
...obj,
owner:"686807f44738e8726b71034c"
}));
await Listing.insertMany(initData.data);
console.log("Data was initialized");
};



initDB();