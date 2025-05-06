const express = require('express');
const router = express.Router();
const HomeProductsSchema = require('../models/HomeProductsSchema');
const User = require('../models/userSchema');
const Order = require("../models/orderSchema");
const adminAuthenticate = require('../Authenticate/adminAuthenticate');


router.get("/isLoggedIn", adminAuthenticate, async (req, res) => {
    try {
      res.status(200).json({ loggedIn: true });
    } catch (err) {
      res.status(401).json({ loggedIn: false });
    }
  });
  


router.get('/dashboard', adminAuthenticate, async (req, res) => {
    try {
      const admin = await User.findById(req.userID);
      if (admin.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  

      const orders = await Order.find();
      const deliveredOrders = await Order.find({ deliveryStatus: "Delivered" });
      const pendingOrders = await Order.find({ deliveryStatus: { $ne: "Delivered" } });
  
      const totalOrders = await Order.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalOrdersDelivered = deliveredOrders.length;
      const totalOrdersPending = pendingOrders.length;

  
      const homeProducts = await HomeProductsSchema.find();
  
      let totalProducts = 0;
      homeProducts.forEach(item => {
        totalProducts += item.Products.length;
      });
  
      let totalRevenue = 0;
      for (const order of orders) {
        const { productId } = await Order.orderIdDecoding(order.orderId);
  
        for (const group of homeProducts) {
          const found = group.Products.find(prod => prod.id === productId);
          if (found) {
            if (found.Price && found.Price[0]) {
              totalRevenue += found.Price[0].deal_price;
            }
            break;
          }
        }
      }
  
      const totalInfo = {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue,
        totalOrdersDelivered,
        totalOrdersPending
      };
  
      res.status(200).json(totalInfo);
    } catch (error) {
      console.log("Error: " + error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  

router.get('/allUsers', adminAuthenticate, async (req, res) => {
    try {
      const admin = await User.findById(req.userID);
      if (admin.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.log("Error: " + error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
  

  router.get('/allOrders', adminAuthenticate, async (req, res) => {
    try {
      const admin = await User.findById(req.userID);
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
  
      const orders = await Order.find();
  

      const decodedOrders = await Promise.all(
        orders.map(async (order) => {
          const { userId, productId} = await Order.orderIdDecoding(order.orderId);
          return {
            orderId: order.orderId,
            userId,
            productId,
            orderStatus: order.orderStatus,
            deliveryStatus: order.deliveryStatus,
            orderDate: order.orderDate,
            deliverDate: order.deliverDate
          };
        })
      );
  
      res.status(200).json(decodedOrders);
    } catch (error) {
      console.log("Error: " + error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
  



router.get('/userDetails/:id',adminAuthenticate,async(req,res)=>{
    try{
        const {id} = req.params;
        const admin = await User.findById(req.userID);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        const user = await User.findById({_id:id});
        res.status(200).json(user);

    }catch(error){
        console.log("Error"+error.message);
    }
})


router.get('/orderDetails/:id', adminAuthenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await User.findById(req.userID);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const order = await Order.findOne({ orderId: id });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Server error" });
    }
});








module.exports = router;