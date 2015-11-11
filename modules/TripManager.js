var Trip = require('../models/trip');
var Comment = require('../models/comment');

function findTripById(tripId, next) {
  console.log('[TripManager] tripId: ' + tripId);
  
  Trip.findById(tripId, function(err, trip) {

    if (err) {
      console.error("ERROR: " + err);
      next(null);
    } else {
      if (!trip) {
        console.log('[TripManager] Cannot find trip with id ' + tripId);
        next(null);
      } else {
        console.log('[TripManager] Found trip with id ' + tripId);
        next(trip);
      }
    }
  });
}

exports.getTrip = function(tripId, next) {
  
  console.log('[TripManager] tripId: ' + tripId);
  findTripById(tripId, function(trip) {
    next(trip);
  });
}

exports.saveTrip = function(trip, next) {
  trip.save(function(err) {
    if (err) {
      console.error('[TripManager] Unable to save trip ' + tripId);
      next();
    } else {
      console.log('[TripManager] Trip saved successfully.');
      next(trip._id)
    }
  });
}

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
          console.log('[TripManager] Comment added successfully');
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
  }
}