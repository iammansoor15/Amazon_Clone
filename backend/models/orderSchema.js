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
            return new Date(this.orderDate.getTime() + 5 * 24 * 60 * 60 * 1000); 
        } 
    }
    
})





orderSchema.statics.orderIdEncoding = async function(userId, productId) {
    const userPart = Buffer.from(userId).toString('base64');
    const productPart = Buffer.from(productId).toString('base64');
    const timestamp = Date.now().toString(36); 
    return `${userPart}.${productPart}.${timestamp}`;
  }
  

  orderSchema.statics.orderIdDecoding = async function(orderId) {
    const [userPart, productPart, timestamp] = orderId.split('.');
    const userId = Buffer.from(userPart, 'base64').toString();
    const productId = Buffer.from(productPart, 'base64').toString();
    return { userId, productId, timestamp };
  }
  

module.exports = new mongoose.model("Order",orderSchema);