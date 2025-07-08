const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewSchema =new Schema({
comment:String,
rating:{
    type:Number,
    min:1,
    max:5
},
createdAt:{
    type:Date,
    default:Date.now()
},
author:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
});
// har review ka sath uska ak author hoga and uske paas hee access hoga usse del add and edit krna ka 
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;