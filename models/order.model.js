const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    price: {type: Number},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}
},{
    versionKey: false,
    toJSON: {virtuals: true}
})

orderSchema.virtual("user", {
    ref: "user",
    localField: "userId",
    foreignField: "_id"
})

const OrderModel = mongoose.model("order", orderSchema);
module.exports = {OrderModel};