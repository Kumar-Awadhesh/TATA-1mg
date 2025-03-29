const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    mobile: {type: Number, unique: true, required: true},
    email: {type: String, unique: true, required: true, lowercase: true, match: [/.+\@.+\..+/, 'Please fill a valid email address']},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user", required: true}
},{
    versionKey: false,
    toJSON: {virtuals: true}
})

userSchema.virtual("order", {
    ref: "order",
    localField: "_id",
    foreignField: "userId"
})

const UserModel = mongoose.model("user", userSchema);
module.exports = {UserModel};