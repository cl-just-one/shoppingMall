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

module.exports = router;