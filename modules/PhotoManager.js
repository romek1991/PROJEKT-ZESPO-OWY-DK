/*
  PHOTO MANAGER
  Module contains wrappers for database operations and business logic for photos in trips
*/

var fs = require('fs');

var Photo = require('../models/photo');
var Trip = require('../models/trip');
//var Comment = require('../models/comment');

//var UserManager = require('../modules/UserManager');

function findPhotoById(photoId, next) {
  console.log('[PhotoManager] photoId: ' + photoId);
  Photo.findById(photoId, function(err, photo) {

    if (err) {
      console.error("[PhotoManager.findPhotoById] ERROR: " + err);
      next(null);
    } else {
      if (!photo) {
        console.log('[PhotoManager.findPhotoById] Cannot find photo with id ' + photoId);
        next(null);
      } else {
        console.log('[PhotoManager.findPhotoById] Found photo with id ' + photoId);
        next(photo);
      }
    }
  });
}

exports.getPhoto = function(req, res) {
  console.log('[PhotoManager.getPhoto] photoId: ' + req.photoId);
  findPhotoById(req.photoId, function(photo) {
    if (photo == null) {
      res.status(404).json({
        message: "Cannot find photo with id " + req.photoId
      });
    } else {
      res.json({
        photo: photo
      });
    }
  });
}

exports.removePhoto = function(req, res){
  // TODO
  /* findTripById(req.tripId, function(trip) {
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


          Trip.findOneAndRemove({ _id: req.tripId }, function(err){
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
  }); */
}

exports.addPhotos = function(req, res) {
  console.log('ADD PHOTOS');
  if (!req.files) { //|| !req.body.startDate || !req.body.endDate) {
    console.log('request must contain files!');
    return res.status(400).json({

      message: "Request must contain files!"
    });
  } else {
  
    Trip.findById(req.body.tripId, function(err, trip) {

      if (err) {
        console.error("[PhotoManager] ERROR: " + err);
        res.status(500).json({message: "Error!"});
      } else {
        if (!trip) {
          res.status(404).json({message: "trip doesn't exist!"});
        } else {
          console.log('req.files:');
          console.log(req.files);
          
          for (i in req.files) {
            var file = req.files[i];
            
            console.log('processing file:');
            console.log(file);
          
            var newPhoto = new Photo({
              name: file.filename,
              filename: file.filename,
              trip: trip
            });
            
            newPhoto.save(function(err) {
              if (err) {
                console.error('[PhotoManager.addPhotos] Unable to add photo with filename ' + file.filename);
                console.log(err);
              } else {
                console.log('[PhotoManager.addPhotos] Photo ' + file.filename + ' saved successfully.');
              }
            });
            
          }
        }
      }
    });
  }
  
  res.redirect('/#/trip/' + req.body.tripId);
};

exports.getPhotosForTrip = function(req, res) {
  
  if (!req.tripId) {
    res.status(500).json({message: "No tripId provided in URL!"});
  } else {
  
    Trip.findById(req.tripId, function(err, trip) {
      if (err) {
        console.error("[PhotoManager] ERROR: " + err);
        res.status(500).json({message: "Error!"});
      } else {
        if (!trip) {
          res.status(404).json({message: "trip doesn't exist!"});
        } else {
          
          Photo.find({trip: trip}).exec(function(err, photos){
            if (err) {
              res.send(500).json({message: "Error while getting photos from DB!"});
            } else {
              res.status(200).json({photos: photos});
            }
          });
          
        }
      }
    });
    
  }
}

exports.getThumbnailForTrip = function(req, res) {
  
  if (!req.tripId) {
    res.status(500).json({message: "No tripId provided in URL!"});
  } else {
  
    Trip.findById(req.tripId, function(err, trip) {
      if (err) {
        console.error("[PhotoManager] ERROR: " + err);
        res.status(500).json({message: "Error!"});
      } else {
        if (!trip) {
          res.status(404).json({message: "trip doesn't exist!"});
        } else {
          
          Photo.find({trip: trip}, 'filename').limit(1).exec(function(err, thumbnail){
            if (err) {
              res.send(500).json({message: "Error while getting thumbnail from DB!"});
            } else {
              console.log('thumbnail: ');
              console.log(thumbnail);
              if (thumbnail[0]) {
                res.sendFile(req.app.get('rootDir') + '/uploads/photos/' + thumbnail[0].filename);
              } else {
                res.sendFile(req.app.get('rootDir') + '/tripThumbnail.png');
              }
            }
          });
          
        }
      }
    });
    
  }
}

exports.getPhotoFile = function(req, res) {
  if (!req.filename) {
    res.status(500).json({message: "No photoId provided in URL!"});
  } else {
    Photo.find({filename: req.filename}).exec(function(err, photo) {
      if (err) {
        console.error('[PhotoManager] getPhotoFile Error: ' + err);
        res.status(500).json({message: "Error!"});
      } else {
        res.sendFile(req.app.get('rootDir') + '/uploads/photos/' + req.filename);
      }
    });
  }
}

exports.defaultAvatar = function(login) {
  console.log("[PhotoManager] Setting default avatar for login " + login);
  fs.createReadStream('avatar.png').pipe(fs.createWriteStream('public/img/avatars/' + login));
}