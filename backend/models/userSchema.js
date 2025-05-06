const mongoose = require('mongoose');
const validator = require('validator');;
const jwt = require('jsonwebtoken');
const secretkey = process.env.KEY;


const userSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    phone: {
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    cpassword: {
        type:String,
        required:true,
        minlength:6
    },
    address:[
        {
            add_firstname: { type: String },
            add_lastname: { type: String },
            add_email: { type: String },
            add_phone: { type: String },
            pincode: { type: String },
            addressLine1: { type: String },
            addressLine2: { type: String },
            landmark: { type: String }
        }
        
    ],
    role:{
        type:String,
        default:"user"
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    cart:Array,
    orders:Array

})


userSchema.methods.generateAuthToken = async function(){
    const userToken = jwt.sign({_id:this._id.toString()},secretkey);
    this.tokens = {token:userToken};
    await this.save();
    return userToken;
};

module.exports = new mongoose.model("USER",userSchema);