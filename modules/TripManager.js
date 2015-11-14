var Trip = require('../models/trip');
var Comment = require('../models/comment');

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

exports.getTrip = function(tripId, next) {
  
  console.log('[TripManager.getTrip] tripId: ' + tripId);
  findTripById(tripId, function(trip) {
    next(trip);
  });
};

exports.updateTrip = function(tripId, trip, next){
    Trip.findOneAndUpdate({ _id: tripId },trip, function(trip){
     next(trip);
    });
};

exports.saveTrip = function(trip, next) {
  trip.save(function(err) {
    if (err) {
      console.error('[TripManager.saveTrip] Unable to save trip ' + tripId);
      next();
    } else {
      console.log('[TripManager.saveTrip] Trip saved successfully.');
      next(trip._id)
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
        author: null,
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