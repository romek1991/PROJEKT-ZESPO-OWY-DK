/*
  TRIP MANAGER
  Module contains wrappers for database operations and business logic for trips
*/

var Trip = require('../models/trip');
var Comment = require('../models/comment');

function checkAccess(req, trip, next) {
  console.log('req.user: ' + req.user);
  console.log('trip.author: ' + trip.author);
  if ( !trip.publicAccess && ( req.user.admin || req.user._id.equals(trip.author) ) )  {
    console.log('check access true');
    next(true);
  } else {
    next(false);
  }
}

function findTripById(tripId, next) {
  console.log('[TripManager] tripId: ' + tripId);
  Trip.findById(tripId, function(err, trip) {

    if (err) {
      console.error("[TripManager.findTripById] ERROR: " + err);
      next(null);
    } else {
      if (!trip) {
        console.log('[TripManager.findTripById] Cannot find trip with id ' + tripId);
        next(null);
      } else {
        console.log('[TripManager.findTripById] Found trip with id ' + tripId);
        next(trip);
      }
    }
  });
}

exports.getTrip = function(req, res) {
  console.log('[TripManager.getTrip] tripId: ' + req.tripId);
  findTripById(req.tripId, function(trip) {
    if (trip == null) {
      res.status(404).json({
        message: "Cannot find trip with id " + req.tripId
      });
    } else {
      checkAccess(req, trip, function(access) {
        if(access) {
          res.json({
            trip: trip
          });
        } else {
          res.status(403).json({
            message: "User has no access to this trip."
          });
        }
      });
    }
  });
}

exports.updateTrip = function(req, res){
  findTripById(req.body.id, function(trip) {
    if (!trip) {
      console.error('[TripManager.updateTrip] Cannot find trip with id ' + req.body.id);
      return res.status(500).json({
        message: "Cannot update trip with id " + req.body.tripId
      });
    } else {
      checkAccess(req, trip, function(access) {
        if (access) {
          updatedTrip = {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            publicAccess: req.body.publicAccess
          }
          Trip.findOneAndUpdate({ _id: req.body.tripId }, updatedTrip, function(err){
            if (err) {
              console.error('[TripManager.updateTrip] ERROR: ' + err);
            } else {
              res.json({
                message: "Successfully updated trip."
              });
            }
          });
        } else {
          res.status(403).json({
            message: "User has no access to this trip."
          });
        }
      });
    }
  });
}









exports.removeTrip = function(req, res){
  findTripById(req.body.id, function(trip) {
    console.log('findTripByID: ' + req.body.id);
    console.log('findTripByID: ' + req.body.tripId);
    console.log('findTripByID: ' + trip);
    if (!trip) {
      console.error('[TripManager.updateTrip] Cannot find trip with id ' + req.body.id);
      return res.status(500).json({
        message: "Cannot remove trip with id " + req.body.tripId
      });
    } else {
      checkAccess(req, trip, function(access) {
        if (access) {

          Trip.findOneAndRemove({ _id: req.body.id }, function(err){
            res.json({
              message: "Trip removed successfully."
            });

          });
        } else {
          res.status(403).json({
            message: "User has no access to this trip."
          });
        }
      });
    }
  });
}













exports.addTrip = function(req, res) {
  
  if (!req.body.name || !req.body.description) { //|| !req.body.startDate || !req.body.endDate) {
    return res.status(400).json({
      message: "Request must consist of parameters: name, description." // ,startDate, endDate
    });
  }
  
  var newTrip = new Trip({
    name: req.body.name,
    author: req.user,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
	  publicAccess: req.body.publicAccess
  });
  
  newTrip.save(function(err) {
    if (err) {
      console.error('[TripManager.addTrip] Unable to add trip with name ' + req.body.name);
        res.status(500).json({
        message: "Failed to save the trip."
      });
    } else {
      console.log('[TripManager.addTrip] Trip saved successfully.');
      return res.json({
        tripId: newTrip._id
      });
    }
  });
};

exports.commentTrip = function(tripId, text, next) {
  findTripById(tripId, function(currentTrip) {
    if(currentTrip == null) {
      next(null);
    } else {
      var newComment = new Comment({
        trip: currentTrip,
        author: req.user,
        text: text
      });
      
      newComment.save(function(err) {
        if (err) {
          throw err;
        } else {
          console.log('[TripManager.commentTrip] Comment added successfully');
        }
      });
      
      next(newComment._id);
    }
  });
}

exports.getTripComments = function(tripId, next) {
  findTripById(tripId, function(currentTrip) {
    if(currentTrip == null) {
      next(null);
    } else {
      Comment.find({trip: currentTrip},function(err, comments){
        next(comments);
      });
    }
  });
}