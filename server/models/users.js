const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        "productId": String,
        "productName": String,
        "salePrice": Number,
        "productNum": Number,
        "productImage": String,
        "checked": Number
    }],
    "addressList": Array
})

module.exports = mongoose.model('user', userSchema)