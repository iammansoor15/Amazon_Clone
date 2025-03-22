const express = require('express');
const router = express.Router();
const HomeProductsSchema = require('../models/HomeProductsSchema');
const user = require('../models/userSchema');
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const Authenticate = require('../Authenticate')





router.get('/getHomeProductsSchema',async (req,res)=>{
    try{
        const HomeProductsData = await HomeProductsSchema.find();
        res.status(201).json(HomeProductsData);
    }
    catch(error){
        console.log("error"+error.message);
    }
})



router.get("/productdetail/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await HomeProductsSchema.findOne({ "Products.id": id },{"Products.$":1});

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});



router.get("/product_types/:Type",async (req,res)=>{
    try{
        const {Type} = req.params;
        const products = await HomeProductsSchema.find({"Type":Type});
        res.status(200).json(products);
    }
    catch(error){
        console.log("Error while retriving Item_Types"+error.message);
        res.status(500).json({message:"Server Error"})
    }
})





const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const trimmedQuery = query.trim();
        const escapedQuery = escapeRegex(trimmedQuery);
        console.log("Escaped search query:", escapedQuery);

        const matchedProduct = await HomeProductsSchema.findOne(
            { Products: { $elemMatch: { ItemTitle: { $regex: `.*${escapedQuery}.*`, $options: "i" } } } },
            { "Products.$": 1, Type: 1 }
        );

        if (!matchedProduct) {
            return res.status(404).json({ message: "No product found" });
        }

        const productsType = await HomeProductsSchema.find({ Type: matchedProduct.Type });

        const searchResult = {
            matchedProduct: matchedProduct.Products[0],
            allProducts: productsType.flatMap(p => p.Products)
        };
        console.log("Matched product:", matchedProduct);
        res.status(200).json(searchResult);

    } catch (error) {
        console.log("Error while retrieving products: " + error.message);
        res.status(500).json({ message: "Server Error" });
    }
});





router.post("/register",async (req,res)=>{

    const {firstname,lastname,email,phone,password,cpassword} = req.body;

    if (!firstname || !lastname || !email || !phone || !password || !cpassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if(password != cpassword){
        return res.status(400).json({ error: 'Passwords don\'t match' });
    }
    if(phone.length!=10){
        return res.status(400).json({error:"Phone must be 10 digits"})
    }
    try{
        const preUserEmail = await user.findOne({email:email});
        const preUserPhone = await user.findOne({phone:phone});

        if (preUserEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        if (preUserPhone) {
            return res.status(400).json({ error: "Phone number already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            firstname,
            lastname,
            email,
            phone,
            password:hashedPassword,
            cpassword:hashedPassword
        })

        const userData = await newUser.save();

        const token = await newUser.generateAuthToken();
        res.cookie("AmazonCookie", token, {
            httpOnly: true,
            sameSite: "lax",
            secure:true
        });

        console.log(userData);
        res.status(200).json(userData)
    }
    catch(error){
        console.error("Registration Error:", error); // Logs full error in the backend
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
})


router.post('/login',async (req,res)=>{
    try{
        const {email} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
        if(email.length==0){
           return res.status(400).json({message:"Field cannot be empty"})
        }
        
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Enter a valid Email"})
         }
        const User = await user.findOne({email:email});
        if(!User){
            return res.status(400).json({message:"User with this email doesn\'t exists, try Creating an account first"})
        }
        res.status(200).json({ message: "Login successful", user: User });

    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
        console.log("Error"+error.message);
    }
})



router.post('/loginPassword', async (req,res)=>{
    const {email,password} = req.body;
    const User = await user.findOne({email:email});

    if(User){
        const pass = await bcrypt.compare(password,User.password);
        if(!pass){
            return res.status(400).json({message:"Password and email doesn\'t match"})
        }else{
            const token = await User.generateAuthToken();
            console.log(token);
            res.cookie("AmazonCookie",token,{
                httpOnly:true,
                sameSite: "lax",
                secure:true

            }) 

            const userDetails = new user({
                firstname: User.firstname,
                lastname: User.lastname,
                email: User.email,
                address: User.address,
                cart: User.cart || [],
            })
            console.log("Cookie Generated")
            return res.status(200).json({message:"Logged-in Successfully", user: userDetails});
        }
    }
})


router.post('/logout',async (req,res)=>{
    try{
        res.clearCookie('AmazonCookie',{path:'/'});
        res.status(200).json("Logout sucessfully")
    }catch(error){
        res.status(400).json({message:"Logout failed"})
    }
})






router.post("/newAddress", Authenticate, async (req, res) => {
    try {
        console.log("Request Body:", req.body);  
        console.log("User ID:", req.userID);  

        const fetchedUser = await user.findOne({ _id: req.userID });
        if (!fetchedUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const { add_firstname, add_lastname, add_email, add_phone, pincode, addressLine1, addressLine2, landmark, isDefault } = req.body;

        if (!add_firstname || !add_lastname || !add_email || !add_phone || !pincode || !addressLine1 || !addressLine2 || !landmark) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (add_phone.length !== 10 || isNaN(add_phone)) {
            return res.status(400).json({ error: "Phone must be exactly 10 digits and numeric" });
        }

        const newAddress = {
            add_firstname,
            add_lastname,
            add_email,
            add_phone,
            pincode,
            addressLine1,
            addressLine2,
            landmark,
        };

        if (isDefault) {
            fetchedUser.address.unshift(newAddress);
        } else {
            fetchedUser.address.push(newAddress);
        }

        await fetchedUser.save();
        const returnAddress = fetchedUser.address[fetchedUser.address.length - 1];
        console.log("New Address Added:", returnAddress);
        return res.status(200).json(returnAddress);
    } catch (error) {
        console.error("Error while adding address:", error);
        return res.status(500).json({ message: "Error while adding the address" });
    }
});


module.exports = router;

