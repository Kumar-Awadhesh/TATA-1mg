const express = require("express");
const jwt = require("jsonwebtoken");
const {OrderModel} = require("../models/order.model");
const {UserModel} = require("../models/user.model");

const orderRouter = express.Router();

orderRouter.post("/addOrder", async(req, res) => {
    const {title, description, price} = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                    userId = decoded.userid;
                    const userData = await UserModel.findById(userId);
                    if(userData.role === "admin" || userData.role === "user"){
                        orderData = new OrderModel({title, description, price, userId: userId});
                        await orderData.save();
                        res.status(200).json({msg: "Order Created Successfully!", orderData});
                    }
                    else{
                        res.status(200).json({msg: "You are not Authorized"});
                    }
                }
                else{
                    res.status(400).json({msg: "invalid token!", err});
                }
            })
        }
        else{
            res.status(200).json({msg: "Please Login First!"});
        }
    }
    catch(err){
        res.status(400).json({msg: "failed to add order!", err});
    }
})

orderRouter.get("/getOrder", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) =>{
                if(decoded){
                    userId = decoded.userid;
                    const userData = await UserModel.findById(userId);
                    if(userData.role === "admin"){
                        const orderData = await OrderModel.find();
                        res.status(200).json({msg: "Orders:", orderData});
                    }
                    else if(userData.role === "user"){
                        const orderData = await OrderModel.find({userId});
                        res.status(200).json({msg: "Order:", orderData});
                    }
                }
                else{
                    res.status(400).json({msg: "invalid token!", err});
                }
            })
        }
        else{
            res.status(400).json({msg: "Please Login First!"})
        }
    }
    catch(err){
        res.status(400).json({msg: "failed to get order data!", err});
    }
})

orderRouter.patch("/updateOrder/:id", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const {id} = req.params;
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                    userId = decoded.userid;
                    const userData = await UserModel.findById(userId);
                    if(userData){
                        if(userData.role === "admin"){
                            const orderData = await OrderModel.findByIdAndUpdate(id, req.body, {new: true});
                            res.status(200).json({msg: "Order Updated Successfully!", orderData});
                        }
                        else if(userData.role === "user"){
                            const order = await OrderModel.findById(id);
                            if(order && order.userId.toString() === userId.toString()){
                                const orderData = await OrderModel.findByIdAndUpdate(id, req.body, {new: true});
                                res.status(200).json({msg: "Order Updated Successfully!", orderData});
                            }
                            else{
                                res.status(200).json({msg: "order not found!"});
                            }
                        }
                        else{
                            res.status(400).json({msg: "You are not Authorized to update!"});
                        }
                    }
                    else{
                        res.status(404).json({msg: "User not found!"});
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
        res.status(400).json({msg: "failed to update order!", err});
    }
})

orderRouter.delete("/orderDelete/:id", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const {id} = req.params;
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                    userId = decoded.userid;
                    const userData = await UserModel.findById(userId);
                    if(userData){
                        if(userData.role === "admin"){
                            await OrderModel.findByIdAndDelete(id);
                            res.status(200).json({msg: "order deleted Successfully!"});  
                        }
                        else if(userData.role === "user"){
                            const order = await OrderModel.findById(id);
                            if(order && order.userId.toString() === userId.toString()){
                                const orderData = await OrderModel.findByIdAndDelete(id);
                                res.status(200).json({msg: "order deleted successfully!"});
                            }
                            else{
                                res.status(404).json({msg: "Order not found"});
                            }
                        }
                        else{
                            res.status(400).json({msg: "you are not authorized to delete!"})
                        }
                    }
                    else{
                        res.status(404).json({msg: "user not found!"});
                    }
                }
                else{
                    res.status(400).json({msg: "invalid token", err});
                }
            })
        }
        else{
            return res.status(200).json({msg: "Please Login First!"})
        }
    }
    catch(err){
        res.status(200).json({msg: "failed to delete order!", err})
    }
})

module.exports = {orderRouter};