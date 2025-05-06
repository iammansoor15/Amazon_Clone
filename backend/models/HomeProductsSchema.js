const mongoose = require('mongoose');

const HomeProductsSchema = new mongoose.Schema({
  Title: String,
  Type: String,  
  Products: [
    {
      id: String,
      ItemTitle: String,
      ShortTitle: String,
      add_info:[{key:String,value:String}],
      desc: [String],
      Price: [{ org_price: Number, deal_price: Number }], 
      pro_imgs: [String], 
      banner_imgs: [String]
    }
  ]
});

module.exports = new mongoose.model("HomeProducts", HomeProductsSchema);