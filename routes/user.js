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

router.put('/', function(req, res, next){
  console.log("tutaj");
  UserManager.updateUser(req, function(user) {
        if(user==null){
          console.log("fail");
          res.status(404).json({ message: "Cannot find user with login" + req.body.id})
        }
        else{
          console.log("succes");
          res.status(200).json({ message: "Success"});
        }
      }
  );
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


router.delete('/:login', function(req, res, next){
  UserManager.removeUser(req, res);


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

/*
  POST /user/search
  Search users with firstName or lastName containing given string
    searchString:   string to search
*/
router.post('/search', function(req, res, next){
  console.log('Searching users like: ' + req.body.searchString );
  var users = UserManager.searchUsers(req.body.searchString, function(users){
    res.json(users);
  });
});

module.exports = router;
