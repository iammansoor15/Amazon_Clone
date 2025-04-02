const { model } = require('mongoose');
const user = require('./models/userSchema');
const jwt = require('jsonwebtoken');
const secretkey = process.env.KEY;


const Authenticate = async (req,res,next)=>{
    try{
        const token = req.cookies.AmazonCookie;
        if(!token){
            return res.status(400).json({ message: "Sign in first" }); 
        }
        const tokenVerification = jwt.verify(token,secretkey);
        const rootUser = await user.findOne({_id:tokenVerification._id , "tokens.token":token});
        if(!rootUser){
            return res.status(400).json("User not Authenticated");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    }catch(error){
        return res.status(400).json({message:"Unauthorised,Invalid token", error:error.message});
    }
}

module.exports = Authenticate;