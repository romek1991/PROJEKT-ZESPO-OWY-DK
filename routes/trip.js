var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Trip = require('../models/trip');
var Comment = require('../models/comment');

var TripManager = require('../modules/TripManager');
var UserManager = require('../modules/UserManager');
var SecurityManager = require('../modules/SecurityManager');

router.use(function(req, res, next) {
  SecurityManager.verifyToken(req, res, next);
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
  TripManager.addTrip(req, res);
});

router.param('tripId', function(req, res, next, param) {
  console.log('param tripId: ' + param);
  req.tripId = param;
  next();
});

/*
  GET /trip
  Get trip with given id
    id:           id of the trip
*/
router.get('/:tripId', function(req, res, next) {
  TripManager.getTrip(req, res);
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
  TripManager.updateTrip(req, res);
});


/*
 DELETE /trip
 Remove trip
 id:            id of the trip
*/
router.delete('/', function(req, res, next) {
  TripManager.removeTrip(req, res);
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
  console.log('res.tripId: ' + req.tripId);
  TripManager.getTripComments(req.tripId, function(tripComments){
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