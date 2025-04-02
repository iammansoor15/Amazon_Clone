const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId : { type: String, unique: true, required: true },
    userId : { type: String, required: true },
    productId : { type: String, required: true },
    orderStatus : {
        type :String ,
        enum: ['Pending', 'Ordered'],
        default: 'Pending'
    },
    deliveryStatus : {
        type :String ,
        enum: ['Started', 'Shipped','Delivered'],
        default: 'Started'
    },
    orderDate: { type: Date, default: Date.now },
    deliverDate: { 
        type: Date, 
        default: function () {
            return new Date(this.orderDate.getTime() + 5 * 24 * 60 * 60 * 1000); // Adds 5 days
        } 
    }
    
})



orderSchema.statics.orderIdEncoding = async function (userId, productId) {
    const timestamp = Date.now().toString(36);
    const randomComponent = Math.floor(Math.random() * 10000).toString(36);
    const userComponent = userId.slice(-4);
    const productComponent = productId.slice(-4);

    const orderId = `${timestamp}-${randomComponent}-${userComponent}-${productComponent}`;

    let existingOrder = await this.findOne({ orderId });
    if (existingOrder) {
        return this.orderIdEncoding(userId, productId);
    }

    return orderId;
};


module.exports = new mongoose.model("Order",orderSchema);