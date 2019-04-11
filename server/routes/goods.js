const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Goods = require('./../models/goods')

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/dumall', { useNewUrlParser: true })

mongoose.connection.on('connected', function() {
    console.log('MongoDB connected success.');
})

mongoose.connection.on('error', function() {
    console.log('MongoDB connected fail.');
})

mongoose.connection.on('disconnected', function() {
    console.log('MongoDB connected disconnected.');
})

router.get('/list', (req, res, next) => {
    let page = parseInt(req.param('page'))
    let pageSize = parseInt(req.param('pageSize'))
    let sort = parseInt(req.param('sort'))
    let skip = (page - 1) * pageSize // 从哪个位置开始查询
    let params = {}
    let priceLevel = req.param('priceLevel')
    let priceGt = ''
    let priceLte = ''
    if (priceLevel !== 'all') {
        switch (priceLevel) {
            case "0":
                priceGt = 0;
                priceLte = 100;
                break;
            case "1":
                priceGt = 100;
                priceLte = 500;
                break;
            case "2":
                priceGt = 500;
                priceLte = 1000;
                break;
            case "3":
                priceGt = 1000;
                priceLte = 5000;
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    goodsModel.sort({ 'salePrice': sort })
    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: '1',
                message: err.message
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

// 加入到购物车
router.post('/addCart', (req, res, next) => {
    let userId = req.cookies.userId
    let productId = req.body.productId
    let User = require('./../models/users')

    User.findOne({ userId: userId }, (err, userDoc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            if (userDoc) {
                let goodsItem = ''
                userDoc.cartList.forEach((item) => {
                    if (item.productId === productId) {
                        goodsItem = item
                        item.productNum++
                    }
                })
                if (goodsItem) {
                    userDoc.save(function(err21, doc21) {
                        if (err21) {
                            res.json({
                                status: "1",
                                msg: err21.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'suc'
                            })
                        }
                    })
                } else {
                    Goods.findOne({ productId: productId }, (err1, doc) => {
                        if (err1) {
                            res.json({
                                status: 1,
                                msg: err1.message
                            })
                        } else {
                            var obj = {};
                            if (doc) {
                                obj = {
                                    "productId": doc.productId,
                                    "productName": doc.productName,
                                    "salePrice": doc.salePrice,
                                    "productImage": doc.productImage,
                                    "productNum": 1,
                                    "checked": 1
                                }
                                userDoc.cartList.push(obj)
                                userDoc.save((err2, doc2) => {
                                    if (err2) {
                                        res.json({
                                            status: 1,
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: 0,
                                            result: "success",
                                            msg: ''
                                        })
                                    }
                                })
                            } else {
                                res.json({
                                    status: 1,
                                    msg: '商品信息不存在'
                                })
                            }
                        }
                    })
                }
            } else {
                res.json({
                    status: 1,
                    msg: '用户不存在'
                })
            }

        }
    })

})

module.exports = router