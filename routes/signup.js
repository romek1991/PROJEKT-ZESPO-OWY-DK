var express = require('express');
var router = express.Router();

var UserManager = require('../modules/UserManager');

/*
  POST /signup
  creates new account for user
    login:              user login
    password:           user password
    email:              user email
    firstName:          user first name
    lastName:           user last name
*/
router.post('/', function(req, res, next) {
  UserManager.signup(req, res);
});

module.exports = router;
