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
          return res.json({
            success: false, message: 'Failed to authenticate token.'
          });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
		  
          // find User in DB
          console.log("[trip] login: " + req.decoded.login);
          
          User.findOne({
            login: req.decoded.login
          }, function(err, user) {

            if (err) throw err;

            if (!user) {
              res.status(404).json({
                message: 'User with login ' + req.decoded.login + ' not found.'
              });
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
      res.status(500).json({
        message: "Failed to save the trip."
      });
    } else {
      console.log('[POST /trip]  Trip saved successfully.');
      res.json({
        tripId: tripId
      });
    }
  });
});

router.param('tripId', function(req, res, next, param) {
  console.log('param tripId: ' + param);
  res.tripId = param;
  next();
});

/*
  GET /trip
  Get trip with given id
    id:           id of the trip
*/
router.get('/:tripId', function(req, res, next) {
  
  TripManager.getTrip(res.tripId, function(trip) {
    if (trip == null) {
      res.status(404).json({
        message: "Cannot find trip with id " + req.tripId
      });
    } else {
      res.json({
        trip: trip
      });
    }
  });

});

/*
  PUT /trip
  Update trip
    id:            id of the trip
    name:          name of the trip
    description:   description of the trip
    publicAccess:  access scope of the trip
 */
router.put('/', function(req, res, next) {
  if(req.body.author == currentUser._id){
    TripManager.updateTrip(req.body.tripId, req.body, function(trip) {
      TripManager.getTrip(req.body.tripId, function(updatedTrip){
        console.log(updatedTrip);
        console.log(req.body);
        if (updatedTrip.name == req.body.name
        && updatedTrip.description == req.body.description
        && updatedTrip.publicAccess == req.body.publicAccess) {
          res.json({
            message: "Trip updated successfully."
          });
        } else {
          res.status(500).json({
            message: "Cannot update trip with id " + req.body.tripId
          });
        }
      } );
    });
  }
  else {
    console.log("given user is not owner of trip");
  }
});

/*
  POST /trip/comment
  Add a comment to the trip
    id:           id of the trip
    text:         text of the comment
*/
router.post('/:tripId/comment', function(req, res, next) {
  
  if(!req.body.text) {
    res.status(500).json({
      message: "Unable to add new comment."
    });
  } else {
    TripManager.commentTrip(res.tripId, req.body.text, function(commentId){
      if (!commentId) {
        res.status(500).json({
          message: "Unable to add new comment."
        });
      } else {
        res.json({
          commentId: commentId
        });
      }
    });
  }
});

/*
  GET /trip/comments
  Get comments to the trip with given id
    id:           id of the trip
    text:         text of the comment
 */
router.get('/:tripId/comments', function(req, res, next) {
  console.log('res.tripId: ' + res.tripId);
  TripManager.getTripComments(res.tripId, function(tripComments){
    if(tripComments == null) {
      res.status(500).json({
        message: "Cannot get comments for trip with id " + req.tripId
      });
    } else {
      res.json({
        comments: tripComments
      });
    }
  });
});

module.exports = router;