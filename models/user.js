const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");
// You're free to define your User how you like. 
// Passport-Local Mongoose will add a username, hash and salt field to 
// store the username, the hashed password and the salt value.


const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);  // automatically username hashing salting and passord sb set

module.exports = mongoose.model('User', userSchema);
