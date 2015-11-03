var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Trip = require('../models/trip');
var jwt = require('jsonwebtoken');

var currentUser;

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
		  
		  // find User in DB
		  console.log("login: " + req.decoded.login);
		  
		  User.findOne({
			login: req.decoded.login
		  }, function(err, user) {

			if (err) throw err;

			if (!user) {
			  res.json({ success: false, message: 'User not found.' });
			} else if (user) {

				console.log('DB USER: ' + user.login);
				console.log('DB PASS: ' + user.password);
				
				currentUser = user;
				next();
			}
		  });
        }
      });
  } else {
    return res.status(403).send({
      success: "false",
      message: "No token provided."
    });
  }
});

/* PUT new trip */
router.put('/', function(req, res, next) {
  
  var login = req.decoded.login;
  
  // find user in DB
  
  var body = req.body;
  var newTrip = new Trip({
    name: body.name,
    author: currentUser,
    //startDate:
    //endDate: 
    description: body.description
	//publicAccess: true;
  });
  
  newTrip.save(function(err) {
    if (err) {
        //if (err.code && err.code == 11000) {  // unique constraint violation
        //  res.json({
        //    success: false,
        //    message: 'User already exists.' + err
        //  });
        //} else {
          throw err;
        //}
      } else {
        console.log('Trip saved successfully');
        res.json({ success: true });
      }
  });
});

module.exports = router;