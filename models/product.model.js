const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String},
    brand: {type: String}
},{
    versionKey: false
})

const ProductModel = mongoose.model("product", productSchema);
module.exports = {ProductModel};