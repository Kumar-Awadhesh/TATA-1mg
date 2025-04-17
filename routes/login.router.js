const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/user.model");

const loginRouter = express.Router();

loginRouter.post("/login", async(req, res) => {
    const {email, password} = req.body;
    try{
        const userData = await UserModel.findOne({email});
        const token = jwt.sign({userid: userData._id}, "masai", {expiresIn: "1d"})
        bcrypt.compare(password, userData.password, async(err, result) => {
            if(result){
                res.status(200).json({msg: "Login Successful!", token});
            }
            else{
                res.status(400).json({msg: "invalid password!", err});
            }
        })
    }
    catch(err){
        res.status(400).json({msg: "Invalid Email!", err});
    }
})

module.exports = {loginRouter};