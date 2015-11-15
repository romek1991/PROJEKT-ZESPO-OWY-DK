var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var SecurityManager = require('../modules/SecurityManager');

/*
  POST /login
  logins user and returns token
    login:              user login
    password:           user password
*/
router.post('/', function(req, res, next) {
  console.log('[POST /login] login: ' + req.body.login + ', password: ' + req.body.password);
  SecurityManager.login(req, res);
});

module.exports = router;