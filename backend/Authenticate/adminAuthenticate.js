const { model } = require('mongoose');
const user = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const secretkey = process.env.KEY;


const adminAuthenticate = async (req,res,next)=>{
    try{
        const token = req.cookies.AmazonCookie;
        if(!token){
            console.log("No token found in cookies");
            return res.status(400).json({ message: "Sign in first" }); 
        }
        
        const tokenVerification = jwt.verify(token,secretkey);
        console.log("Token verified:", tokenVerification);
        
        const rootUser = await user.findOne({_id:tokenVerification._id , "tokens.token":token});
        if(!rootUser){
            console.log("User not found with token");
            return res.status(400).json("User not Authenticated");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    }catch(error){
        console.error("Authentication error:", error);
        return res.status(400).json({message:"Unauthorised,Invalid token", error:error.message});
    }
}


module.exports = adminAuthenticate;
