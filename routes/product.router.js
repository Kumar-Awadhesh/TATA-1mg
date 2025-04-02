const express = require("express");
const jwt = require("jsonwebtoken");
const {ProductModel} = require("../models/product.model");
const { UserModel } = require("../models/user.model");

const productRouter = express.Router();

productRouter.post("/addProduct", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const {title, description, price, category, brand} = req.body;
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                    userId = decoded.userid;
                    const user = await UserModel.findById(userId);
                    if(user?.role === "admin"){
                        const productData = new ProductModel({title, description, price, category, brand});
                        await productData.save();
                        res.status(200).json({msg: "Product Added Successfully!", productData});
                    }
                    else{
                        res.status(400).json({msg: "You are not Authorized!"});
                    }
                }
                else{
                    res.status(400).json({msg: "invalid token!", err});
                }
            })
        }
        else{
            res.status(400).json({msg: "Please Login First!"});
        }
    }
    catch(err){
        res.status(400).json({msg: "failed to add product!", err});
    }
})

productRouter.get("/getProduct", async(req, res) => {
    try{
        const productData = await ProductModel.find();
        res.status(200).json({products:productData});
    }
    catch(err){
        res.status(400).json({msg: "failed to get products!", err});
    }
})

module.exports = {productRouter};