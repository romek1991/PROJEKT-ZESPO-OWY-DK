var express = require('express');
var router = express.Router();

var User = require('../models/user');

var UserManager = require('../modules/UserManager');
var SecurityManager = require('../modules/SecurityManager');
var TripManager = require('../modules/TripManager');

router.use(function(req, res, next) {
  SecurityManager.verifyToken(req, res, next);
});

router.param('login', function(req, res, next, param) {
  console.log('param login: ' + param);
  req.login = param;
  next();
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
  UserManager.getUserByLogin(req.login, function(user) {
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

/*
  GET /user/{login}/trips
  Get trips of user with given login
    login:           login of the user
*/
router.get('/:login/trips', function(req, res, next) {
  TripManager.getUserTripsHeaders(req, res);
    // if (user == null) {
      // res.status(404).json({
        // message: "Cannot find user with login " + req.params.login
      // });
    // } else {
      // res.json({
        // user: user
      // });
    // }
  // });

});

module.exports = router;
