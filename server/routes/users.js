var express = require('express');
var router = express.Router();
const User = require('./../models/users')
require('./../util/util')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
    var params = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }
    User.findOne(params, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            if (doc) {
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                })
                res.cookie('userName', doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                })
                res.json({
                    status: 0,
                    msg: '',
                    result: {
                        userName: doc.userName
                    }
                })
            } else {
                res.json({
                    status: 1,
                    msg: '查询失败'
                })
            }
        }
    })
})

// 获取购物车总数
router.get('/getCartCount', (req, res, next) => {
    let userId = req.cookies.userId
    User.findOne({
        userId: userId
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.message
            })
        } else {
            let cartCount = 0
            doc.cartList.forEach((item) => {
                cartCount += parseInt(item.productNum)
            })
            res.json({
                status: '0',
                msg: '',
                result: {
                    cartCount: cartCount
                }
            })
        }
    })
})

router.post('/logout', (req, res, next) => {
    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    })
    res.cookie('userName', '', {
        path: '/',
        maxAge: -1
    })
    res.json({
        status: '0',
        msg: '',
        result: ''
    })
})

router.get('/checkLogin', (req, res, next) => {
    if (req.cookies.userId) {
        res.json({
            status: '0',
            msg: '',
            result: {
                userName: req.cookies.userName
            }
        })
    }
})

router.get('/cartList', (req, res, next) => {
    let userId = req.cookies.userId
    User.findOne({
        userId: userId
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
})

router.post('/cartDel', (req, res, next) => {
    let userId = req.cookies.userId
    let productId = req.body.productId
    User.update({
        userId: userId
    }, {
        $pull: {
            "cartList": {
                'productId': productId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.massge
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: doc
            })
        }
    })
})

router.post('/editCheckAll', (req, res, next) => {
    let userId = req.cookies.userId
    let checkAll = req.body.checkAll

    User.findOne({
        userId: userId
    }, (err, user) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.massge
            })
        } else {
            if (user) {
                user.cartList.forEach((item) => {
                    item.checked = checkAll
                })
                user.save((err1, doc) => {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: '',
                            result: err.messge
                        })
                    }
                })
                res.json({
                    status: '0',
                    msg: '',
                    result: 'success'
                })
            }
        }
    })
})

// 编辑购物车
router.post('/editCart', (req, res, next) => {
    let userId = req.cookies.userId
    let productId = req.body.productId
    let productNum = req.body.productNum
    let checked = req.body.checked
    User.update({
        "userId": userId,
        "cartList.productId": productId
    }, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.massge
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: "success"
                })
            }
        }
    })
})

router.get('/addressList', (req, res, next) => {
    let userId = req.cookies.userId
    User.findOne({
        userId: userId
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.message
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: doc.addressList
            })
        }
    })
})

// 设置默认地址
router.post('/setDefault', (req, res, next) => {
    let userId = req.cookies.userId
    let addressId = req.body.addressId
    if (!addressId) {
        res.json({
            status: '1005',
            msg: 'addressId is null',
            result: ''
        })
    }
    User.findOne({
        userId: userId
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '',
                result: err.message
            })
        } else {
            doc.addressList.forEach((item) => {
                if (item.addressId == addressId) {
                    item.isDefault = true
                } else {
                    item.isDefault = false
                }
            })
            doc.save((err1, doc1) => {
                if (err1) {
                    res.json({
                        status: '1',
                        msg: '',
                        result: err.message
                    })
                } else {
                    res.json({
                        status: '0',
                        msg: '',
                        result: 'success'
                    })
                }
            })
        }
    })
})

// 删除地址列表
router.post('/delAddres', (req, res, next) => {
    let userId = req.cookies.userId
    let addressId = req.body.addressId
    User.update({
        userId: userId
    }, {
        $pull: {
            "addressList": {
                "addressId": addressId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.messge,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'success'
            })
        }
    })
})

// 创建订单
router.post('/createOrder', (req, res, next) => {
    var userId = req.cookies.userId
    var addressId = req.body.addressId
    var orderTotal = req.body.orderTotal

    User.findOne({
        userId: userId
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.messge,
                result: ''
            })
        } else {
            var address = ''
            var goodsList = []
                // 获取当前用户的地址信息
            doc.addressList.forEach((item) => {
                    if (item.addressId == addressId) {
                        address = item
                    }
                })
                // 获取当前用户购物车的商品
            doc.cartList.filter((item) => {
                if (item.checked == '1') {
                    goodsList.push(item)
                }
            })

            var platform = '622'
            var r1 = Math.floor(Math.random() * 10);
            var r2 = Math.floor(Math.random() * 10);

            var sysDate = new Date().Format('yyyyMMddhhmmss')
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
            var orderId = platform + r1 + sysDate + r2

            var order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: '1',
                createDate: createDate
            }
            doc.orderList.push(order)
            doc.save((err1, doc1) => {
                if (err1) {
                    res.json({
                        status: '1',
                        msg: err.messge,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '0',
                        msg: '',
                        result: {
                            orderId: order.orderId,
                            orderTotal: order.orderTotal
                        }
                    })
                }
            })
        }
    })
})

router.get('/orderDetail', (req, res, next) => {
    let userId = req.cookies.userId
    let orderId = req.param('orderId')
    if (!orderId) {
        res.json({
            status: '1',
            msg: '此订单未创建',
            result: ''
        })
    }
    User.findOne({
        userId: userId
    }, (err, userInfo) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.messge,
                result: ''
            })
        } else {
            var orderTotal = ''
            let orderList = userInfo.orderList;
            if (orderList.length > 0) {
                orderList.forEach((item) => {
                    if (item.orderId == orderId) {
                        orderTotal = item.orderTotal
                    }
                })
                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        orderId: orderId,
                        orderTotal: orderTotal
                    }
                })
            } else {
                res.json({
                    status: '1',
                    msg: '此订单不存在',
                    result: ''
                })
            }
        }
    })
})

module.exports = router;