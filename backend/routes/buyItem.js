const express = require('express');
const router = express.Router();
const HomeProductsSchema = require('../models/HomeProductsSchema');
const User = require('../models/userSchema');
const Order = require("../models/orderSchema");
const Authenticate = require('../Authenticate/Authenticate');
const userSchema = require('../models/userSchema');



router.post("/buyItem/:id", Authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const item = await HomeProductsSchema.findOne({ "Products.id": id }, { "Products.$": 1 });

        if (!item || !item.Products || item.Products.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const productToBuy = item.Products[0].id;
        const buyingUser = await User.findOne({ _id: req.userID });

        if (!buyingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ productToBuy });

    } catch (error) {
        console.error("Error in buyItem:", error);
        return res.status(400).json({ message: "Can't buy this item at this time" });
    }
});




router.post("/buyItemsFromCart", Authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userID);
        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const selectedItems = req.body.selectedItems || [];
        if (selectedItems.length === 0) {
            return res.status(400).json({ message: "No items selected" });
        }

        const cartItems = user.cart.filter(item => selectedItems.includes(item.id));
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Selected items not found in cart" });
        }

        const productIds = cartItems.map(item => item.id);

        return res.status(200).json({ productIds });

    } catch (error) {
        console.error("Error in buyItemsFromCart:", error.message);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});





router.post("/paymentSuceed", Authenticate, async (req, res) => {
    try {
        const { productIds } = req.body; 

        if (!productIds || productIds.length === 0) {
            console.log("end");
            return res.status(400).json({ message: "No product IDs provided" });
        }
        const user = await User.findById(req.userID);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const items = await HomeProductsSchema.find({ "Products.id": { $in: productIds } });
        console.log("Products found in database:", items);

        if (!items.length) {
            return res.status(404).json({ message: "Some selected products are unavailable" });
        }
        const orders = [];
        for (const productDoc of items) {
            const matchingProducts = productDoc.Products.filter(p => productIds.includes(p.id));

            for (const product of matchingProducts) {
                let orderId;
                try {
                    orderId = await Order.orderIdEncoding(user._id.toString(), product.id.toString());
                } catch (err) {
                    console.error("Error generating orderId:", err.message);
                    return res.status(500).json({ message: "Failed to generate order ID", error: err.message });
                }

                orders.push({
                    orderId: orderId.toString(),
                    userId: user._id,
                    productId: product.id,
                    orderDate: new Date(Date.now() + (5.5 * 60 * 60 * 1000)),
                    deliverDate: new Date(Date.now() + (5.5 * 60 * 60 * 1000)),
                    orderStatus: "Ordered"
                });
            }
        }
        console.log("Orders to be inserted:", orders);
        await Order.insertMany(orders);

        await User.findByIdAndUpdate(req.userID, { $push: { orders: { $each: orders.map(o => o.orderId) } } });
        await User.findByIdAndUpdate(req.userID, {$pull: { cart: { "items.id": { $in: productIds } } }});

        return res.status(200).json({ orderIds: orders.map(o => o.orderId) });

    } catch (error) {
        console.error("Error in paymentSuceed:", error.message);
        return res.status(500).json({ message: "An error occurred while processing the order", error: error.message });
    }
});




router.get('/usersOrders', Authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userID }).select("firstname");
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const orders = await Order.find({ userId: req.userID }).sort({ orderDate: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }


        const responseData = await Promise.all(
            orders.map(async (order) => {
                const fetchProduct = await HomeProductsSchema.findOne(
                    { "Products.id": order.productId },
                    { "Products.$": 1 }
                );

                if (!fetchProduct || !fetchProduct.Products || fetchProduct.Products.length === 0) {
                    return null;
                }

                const product = fetchProduct.Products[0];

                return {
                    firstname: user.firstname,
                    productTitle: product.ItemTitle,
                    productImg: product.pro_imgs?.[0],
                    time: order.orderDate,
                    price:product.Price?.[0]?.deal_price,
                    orderId: order._id,
                    productId: order.productId,
                };
            })
        );

        const filteredResponseData = responseData.filter((order) => order !== null);

        if (!filteredResponseData.length) {
            return res.status(404).json({ message: "No product details found for orders" });
        }

        return res.status(200).json(filteredResponseData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Problem" });
    }
});




module.exports = router;