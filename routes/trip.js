var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Trip = require('../models/trip');
var Comment = require('../models/comment');
var TripManager = require('../modules/TripManager');
var UserManager = require('../modules/UserManager');

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
              res.json({ success: false, message: 'User with login ' + req.decoded.login + ' not found.' });
            } else if (user) {
              console.log('[/trip] User ' + user.login + ' authenticated.');              
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

/*
  POST /trip
  Add new trip as current user
    name:         name of the trip
    description:  description
    startDate:    start date of the trip
    endDate:      end date of the trip
    publicAccess  is trip visible publicly
*/
router.post('/', function(req, res, next) {

  var newTrip = new Trip({
    name: req.body.name,
    author: currentUser,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
	  publicAccess: req.body.publicAccess
  });
  
  TripManager.saveTrip(newTrip, function(tripId) {
    if (!tripId) {
      console.log('[POST /trip] Failed to save trip!');
    } else {
      console.log('[POST /trip]  Trip saved successfully.');
      res.json({
        success: true,
        tripId: tripId
      });
    }
  });
});

/*
  GET /trip/{id}
  Get trip with given id
*/
router.get('/:tripId', function(req, res, next) {
  
  TripManager.getTrip(req.params.tripId, function(trip) {
    console.log("____TRIP: " + trip);
    if (trip == null) {
      res.json({
        succes: false,
        message: "Cannot find trip with id " + req.params.tripId
      });
    } else {
      res.json({
        success: true,
        trip: trip
      });
    }
  });

});

/*
  POST /trip/{id}/comment
  Add a comment to the trip
    {id}:         id of the trip
    text:         text of the comment
*/
router.post('/:tripId/comment', function(req, res, next) {
  
  if(!req.body.text) {
    res.json({
      success: false,
      message: "Unable to add new comment."
    });
  } else {
    TripManager.commentTrip(req.params.tripId, req.body.text, function(commentId){
      if (!commentId) {
        res.json({
          success: false,
          message: "Unable to add new comment."
        });
      } else {
        res.json({
          success: true,
          commentId: commentId
        });
      }
    });
  }
});

/*
  GET /trip/{id}/comments
  Get comments to the trip with given id
    {id}:         id of the trip
    text:         text of the comment
*/
router.get('/:tripId/comments', function(req, res, next) {
  TripManager.getTripComments(req.params.tripIdfunction(currentTrip){
    if(currentTrip == null) {
      res.json({
        succes: false,
        message: "Cannot find trip with id " + req.params.tripId
      });
    } else {
            
    }
  });
});

module.exports = router;