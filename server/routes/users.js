var express = require('express');
var router = express.Router();
const User = require('./../models/users')

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

module.exports = router;