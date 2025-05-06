const HomeProductsSchema = require('./models/HomeProductsSchema');
const HomeProductsdata = require('./constants/HomeProducts.json');

const DefaultData = async()=>{
    try{

        await HomeProductsSchema.deleteMany({});
        console.log("Deleted previous Data");
        const storeData = await HomeProductsSchema.insertMany(HomeProductsdata.Grid);
        console.log("Inserting data");
        console.log("Inserted Successfully");

    }
    catch(error){
        console.log("Data insertion error" + error.message);
    }
}

module.exports = DefaultData;