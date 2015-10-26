var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
  var token = req.headers['x-access-token'];
  
  console.log('token:' + token);
  
  if (token) {
      jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
  } else {
    return res.status(403).send({
      success: "false",
      message: "No token provided."
    });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  console.log('req.decoded:' + req.decoded);
  
  User.find({}, function(err, users) {
    res.json(users);
  });
});

module.exports = router;
