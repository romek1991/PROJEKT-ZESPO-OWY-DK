/*
  TRIP MANAGER
  Module contains wrappers for database operations and business logic for trips
*/

var Trip = require('../models/trip');
var Comment = require('../models/comment');
var Photo = require('../models/photo');

var fs = require('fs');

var UserManager = require('../modules/UserManager');

function checkAccessForModification(req, trip, next) {
  console.log('req.user: ' + req.user);
  console.log('trip.author: ' + trip.author);
  if (  req.user.admin || req.user._id.equals(trip.author._id)  )  {
    console.log('check access true');
    next(true);
  } else {
    next(false);
  }
}

function checkAccessForRead(req, trip, next) {
  console.log('req.user: ' + req.user);
  console.log('trip.author: ' + trip.author);
  if ( trip.publicAccess || req.user._id.equals(trip.author._id) || req.user.admin )  {
    console.log('check access true');
    next(true);
  } else {
    next(false);
  }
}

function findTripById(tripId, next) {
  console.log('[TripManager] tripId: ' + tripId);
  Trip.findById(tripId).populate('author').exec(function(err, trip) {

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
      checkAccessForRead(req, trip, function(access) {
        //access=true;
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
      checkAccessForModification(req, trip, function(access) {
        if (access) {
            trip.name=req.body.name;
            trip.description=req.body.description;
            trip.startDate=req.body.startDate;
            trip.endDate=req.body.endDate;
            trip.publicAccess=req.body.publicAccess;

          console.log(trip);

          Trip.findOneAndUpdate({ _id: req.body.id }, trip, function(err){
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
  findTripById(req.tripId, function(trip) {
    console.log('findTripByID: ' + req.body.id);
    console.log('remove trip - trip id: ' + req.tripId);
    console.log('findTripByID: ' + trip);
    if (!trip) {
      console.error('[TripManager.updateTrip] Cannot find trip with id ' + req.tripId);
      return res.status(500).json({
        message: "Cannot remove trip with id " + req.tripId
      });
    } else {
      checkAccessForModification(req, trip, function(access) {
        if (access) {
          
          
          Photo.find({trip: trip}, function(err, tripPhotos) {
            console.log("_________________TRIP PHOTOS:");
            console.log(tripPhotos);
            for(var i in tripPhotos) {
              var filename = tripPhotos[i].filename;
              console.log('filename: ' + filename);
              fs.unlinkSync(req.app.get('rootDir') + '/uploads/photos/' + filename);
            }
            
            Photo.find({trip: trip}).remove(function(){
            
              Comment.find({trip: trip}).remove(function(){
                
                Trip.findOneAndRemove({ _id: req.tripId }, function(err){
                  res.json({
                    message: "Trip removed successfully."
                  });
                });

              });
              
              
              
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

exports.commentTrip = function(req, res) {
  findTripById(req.tripId, function(currentTrip) {
    if(currentTrip == null) {
      res.status(404).json({
        message: "Unable to find trip with id: " + req.tripId
      });
    } else {
      var newComment = new Comment({
        trip: currentTrip,
        author: req.user,
        text: req.body.text
      });
      
      newComment.save(function(err, newComment) {
        if (err) {
          return res.status(500).json({
            message: "Unable to add new comment."
          });
        } else {
          console.log('[TripManager.commentTrip] Comment added successfully');
          return res.json({
            commentId: newComment._id
          });
        }
      });
    }
  });
}

exports.getTripComments = function(tripId, next) {
  findTripById(tripId, function(currentTrip) {
    if(currentTrip == null) {
      next(null);
    } else {
      Comment.find({trip: currentTrip}).populate('author').exec(function(err, comments){
        next(comments);
      });
    }
  });
}

exports.getUserTripsHeaders = function(req, res) {
  UserManager.getUserByLogin(req.login, function(user) {
    var isOwner = (req.user.login === user.login) || req.user.isAdmin;
    console.log("____isOwner:" + isOwner);
    if (isOwner) {
      // return both public and private trips of the user
      Trip.find({author: user}, 'name createdDate startDate endDate publicAccess', function(err, userTrips) {
        if (err) {
          return res.status(500).json({
            message: "Unable to get trips for user."
          });
        }
        
        return res.json({
          trips: userTrips
        });
      });
    } else {
      // return only public trips of the user
      Trip.find(
          {$and:[{author: user},
          {$or:[
            {publicAccess: null}, {publicAccess: true}
          ]}]}, 'name createdDate startDate endDate publicAccess', function(err, userTrips) {
        if (err) {
          return res.status(500).json({
            message: "Unable to get trips for user."
          });
        }
        
        return res.json({
          trips: userTrips
        });
      });
    }
  });
}

exports.getNewestTripsHeaders = function(req, res) {
  Trip
    .find({$or:[ {'publicAccess':null}, {'publicAccess':true}]}, 'name createdDate startDate endDate author publicAccess')
    .populate('author', 'login firstName lastName')
    .sort('-createdDate')
    .limit(10)
    .exec(function(err, newestTrips) {
      if (err) {
        return res.status(500).json({
          message: "Unable to get trips for user."
        });
      }      
      return res.json({
        trips: newestTrips
      });
    });
}

  
exports.searchTrips = function(searchString, next) {
  if (searchString=="") {
    next([]);
  } else {
    Trip
      .find({$and:[
        {name: new RegExp('.*'+searchString+'.*', "i")},
        {publicAccess: true}
      ]})
      .populate('author', 'firstName lastName')
      .exec(function(err, trips){
        if (err) throw err;
        next(trips);
      });
  }
}