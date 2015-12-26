var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer  = require('multer');

var avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/avatars');
  },
  filename: function (req, file, cb) {
    cb(null, req.body.username);
  }
});

var photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/photos');
  },
  filename: function (req, file, cb) {
    cb(null, req.body.tripId + '_' + file.originalname);
  }
});

var uploadAvatar = multer({ storage: avatarStorage });
var uploadPhotos = multer({ storage: photoStorage });

// var User = require('../models/user');
// var Trip = require('../models/trip');
// var Comment = require('../models/comment');

var TripManager = require('../modules/TripManager');
var PhotoManager = require('../modules/PhotoManager');
// var UserManager = require('../modules/UserManager');
var SecurityManager = require('../modules/SecurityManager');

router.use(function(req, res, next) {
  SecurityManager.verifyToken(req, res, next);
});

router.param('tripId', function(req, res, next, param) {
  console.log('param tripId: ' + param);
  req.tripId = param;
  next();
});

/*
  POST /photo
  Add new photo to the trip
    tripId:         id of the trip
    name:         name of photo
    description:  description of photo
*/
router.post('/', uploadPhotos.array('photos', 50), function (req, res, next) {
  console.log("in POST /photo");
  console.log(req.body);
  //console.log(req.user);
  console.log(req.files);

  PhotoManager.addPhotos(req, res);
  //res.status(200).redirect('/#/edittrip/' + req.body.tripId);
});

/*
  POST /photo/avatar
  Add new avatar for current user
*/
router.post('/avatar', uploadAvatar.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.body);
  console.log(req.user);
  console.log(req.file);
  
  res.status(200).redirect('/#/profile/');
});

/*
  GET /photo/trip/:tripId
  Get photos objects for particular trip
    tripId:   i
*/
router.get('/trip/:tripId', function (req, res, next) {
  PhotoManager.getPhotosForTrip(req, res);
});

module.exports = router;