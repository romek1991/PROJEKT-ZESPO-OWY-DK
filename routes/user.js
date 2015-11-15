var express = require('express');
var router = express.Router();

var User = require('../models/user');

var UserManager = require('../modules/UserManager');
var SecurityManager = require('../modules/SecurityManager');

router.use(function(req, res, next) {
  SecurityManager.verifyToken(req, res, next);
});

/*
  GET /user/all
  get list of all users
*/
router.get('/all', function(req, res, next) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

/*
  GET /user/{login}
  Get user with given login
    login:           login of the user
*/
router.get('/:login', function(req, res, next) {
  UserManager.getUserByLogin(req.params.login, function(user) {
    if (user == null) {
      res.status(404).json({
        message: "Cannot find user with login " + req.params.login
      });
    } else {
      res.json({
        user: user
      });
    }
  });

});

module.exports = router;
