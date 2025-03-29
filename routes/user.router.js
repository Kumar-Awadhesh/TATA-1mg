const express = require("express");
const {UserModel} = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/registerUser", async(req, res) => {
    const {name, mobile, email, role, password} = req.body;
    try{
        bcrypt.hash(password, 6, async(err, hash) => {
            if(hash){
                const userData = new UserModel({name, mobile, email, role, password: hash});
                await userData.save();
                res.status(200).json({msg: "User Register Successfully!", userData});
            }
            else{
                return res.status(400).json({msg: "failed to hash the password!", err});
            }
        })
    }
    catch(err){
        res.status(400).json({msg: "failed to register user!", err});
    }
})

userRouter.get("/getUser", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                    userId = decoded.userid;
                    user = await UserModel.findById(userId);
                    if(user?.role === "admin"){
                        const userData = await UserModel.find().populate("order");
                        res.status(200).json({msg: "Users", userData});
                    }
                    else if(user?.role === "user"){
                        const userData = await UserModel.findById(userId).populate("order");
                        res.status(200).json({msg: "Users", userData});
                    }
                    else{
                        res.status(400).json({msg: "you are not authorized!"});
                    }
                }
                else{
                    res.status(200).json({msg: "invalid token!", err});
                }
            })
        }
        else{
            res.status(200).json({msg: "Please Login First"})
        }
    }
    catch(err){
        res.status(400).json({msg: "failed to get user Data!", err});
    }
})

userRouter.patch("/updateUser/:id", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const {name, email, mobile, password} = req.body;
    const {id} = req.params;
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                   userId = decoded.userid;
                    const user = await UserModel.findById(id);
                    if(user){
                        if(user.role === "admin"){
                            bcrypt.hash(password, 6, async(err, hash) => {
                                if(hash){
                                    const userData = await UserModel.findByIdAndUpdate(id, {name, mobile, email, password: hash}, {new: true});
                                    res.status(200).json({msg: "User Updated Successfully!", userData});
                                }
                                else{
                                    res.status(400).json({msg: "failed to hash password", err});
                                }
                            })
                        }
                        else if(user.role === "user"){
                            if(user._id.toString() === userId.toString()){
                                bcrypt.hash(password, 6, async(err, hash) => {
                                    if(hash){
                                        const userData = await UserModel.findByIdAndUpdate(id, {name, mobile, email, password: hash}, {new: true});
                                        res.status(200).json({msg: "User Updated Successfully!", userData});
                                    }
                                    else{
                                        res.status(400).json({msg: "failed to hash password", err});
                                    }
                                })
                            }
                            else{
                                res.status(400).json({msg: "invalid user!"});
                            }
                        }
                        else{
                            res.status(400).json({msg: "you not authorized to update!"});
                        }
                    }
                    else{
                        res.status(404).json({msg: "user not found!"});
                    }
                }
                res.status(400).json({msg: "invalid token!"}, err);
            })
        }
        else{
            res.status(400).json({msg: "Please Login First!"})
        }
    }
    catch(err){
        res.status(400).json({msg: "failed to update user!", err});
    }
})

userRouter.delete("/deleteUser/:id", async(req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const {id} = req.params;
    try{
        if(token){
            jwt.verify(token, "masai", async(err, decoded) => {
                if(decoded){
                   userId = decoded.userid;
                    const user = await UserModel.findById(id);
                    if(user){
                        if(user.role === "admin"){
                            await UserModel.findByIdAndDelete(id);
                            res.status(200).json({msg: "User Deleted Successfully!"});
                        }
                        else if(user.role === "user"){
                            if(id.toString() === userId.toString()){
                                console.log(user._id)
                                await UserModel.findByIdAndUpdate(id);
                                res.status(200).json({msg: "User Deleted Successfully!"});
                            }
                            else{
                                res.status(400).json({msg: "invalid user!"});
                            }
                        }
                        else{
                            res.status(400).json({msg: "you not authorized to delete!"});
                        }
                    }
                    else{
                        res.status(404).json({msg: "user not found!"});
                    }
                }
                res.status(400).json({msg: "invalid token!"}, err);
            })
        }
        else{
            res.status(400).json({msg: "Please Login First!"})
        }
    }
    catch(err){
        res.status(400).json({msg: "failed to update user!", err});
    }
})

module.exports = {userRouter};