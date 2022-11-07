const mongoose = require("mongoose");

// creating schema using new mongoose where userchema is the schema name
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    customer_id: Number,
    balance: Number

});
const productSchema = new mongoose.Schema({
product_id:Number,
product_type :String,
product_name:String,
product_price :Number
  
});

// const inventorySchema = new mongoose.Schema({
//     inventory_id : Number,
//     inventory_type: String,
//     item_name : String,
//     available_quantity: Number
// });

const orderSchema = new mongoose.Schema({
    customer_id : Number,
    product_id: Number,
    product_name: String,
    quantity: Number
});

// user is the collection name
const userModal = mongoose.model("user",userSchema);
// const inventory_Modal = mongoose.model("inventory",inventorySchema);
const orderModel = mongoose.model("order",orderSchema);
const product_Modal=mongoose.model("product",productSchema)
// exporting the schema
// module.exports = {userModal,inventory_Modal,orderModel,product_Modal};
module.exports = {userModal,orderModel,product_Modal};