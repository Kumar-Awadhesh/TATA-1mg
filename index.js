const express = require("express");
const mongoose = require("mongoose");
const {userRouter} = require("./routes/user.router");
const {productRouter} = require("./routes/product.router");
const {orderRouter} = require("./routes/order.router");
const {loginRouter} = require("./routes/login.router");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));


app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/auth", loginRouter);

app.listen(3000, async() => {
    try{
        await mongoose.connect("mongodb+srv://kumaravi0506:Gabriel%40511@myfirst-cluster.nvsvh.mongodb.net/TATA-1mg?tls=true&retryWrites=false&w=majority&appName=MyFirst-Cluster");
        console.log("connected to atlas DB!");
        console.log("server ruuning at http://localhost:3000");
    }
    catch(err){
        console.log("failed to connect to DB"+" "+err);
    }
})