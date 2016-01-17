var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer  = require('multer');

var avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/avatars');
  },
  filename: function (req, file, cb) {
    console.log("req.body:");
    console.log(req.body);
    console.log("req.user:");
    console.log(req.user);
    cb(null, req.body.username);
  }
});

var photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/photos');
  },
  filename: function (req, file, cb) {
    console.log(req.body.tripId);
    console.log(req.body.token);
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

// Security manager used directly in methods because multer firstly has to parse form

router.param('tripId', function(req, res, next, param) {
  console.log('param tripId: ' + param);
  req.tripId = param;
  next();
});

router.param('filename', function(req, res, next, param) {
  console.log('param filename: ' + param);
  req.filename = param;
  next();
});

/*
  POST /photo
  Add new photo to the trip
    tripId:         id of the trip
    token:          token
*/
router.post('/', uploadPhotos.array('photos', 50), function (req, res, next) {
  
  SecurityManager.verifyToken(req, res, function() {
    console.log("in POST /photo");
    console.log(req.body);
    //console.log(req.user);
    console.log(req.files);

    PhotoManager.addPhotos(req, res);
    //res.status(200).redirect('/#/edittrip/' + req.body.tripId);
  });
  
});

/*
  POST /photo/avatar
  Add new avatar for current user
*/
router.post('/avatar', uploadAvatar.single('avatar'), function (req, res, next) {
  
  SecurityManager.verifyToken(req, res, function() {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.body);
    console.log(req.user);
    console.log(req.file);
    res.status(200).redirect('/#/profile/');
  });
});

/*
  POST /photo/avatar/reset
  Set default avatar for authenticated user
*/
router.post('/avatar/reset', function (req, res, next) {
  SecurityManager.verifyToken(req, res, function() {
    PhotoManager.defaultAvatar(req.user.login);
  });
});

/*
  GET /photo/trip/:tripId
  Get photos objects for particular trip
    tripId:   trip id
*/
router.get('/trip/:tripId', function (req, res, next) {
  SecurityManager.verifyToken(req, res, function() {
    PhotoManager.getPhotosForTrip(req, res);
  });
});

/*
  GET /photo/tripThumbnail/:tripId
  Get thumbnail photo for particular trip
    tripId:   trip id
*/
router.get('/tripThumbnail/:tripId', function (req, res, next) {
  PhotoManager.getThumbnailForTrip(req, res);
});

/*
  GET /photo/latestPhotos
  Get thumbnail photo for particular trip
    tripId:   trip id
*/
router.get('/latest', function (req, res, next) {
  SecurityManager.verifyToken(req, res, function() {
    PhotoManager.getLatestPhotos(req, res);
  });
});

/*
  GET /photo/user/:login
  Get photo headers for particular trip
    login:   login of the user
*/
router.get('/user/:login', function (req, res, next) {
  SecurityManager.verifyToken(req, res, function() {
    PhotoManager.getUserPhotosHeaders(req, res);
  });
});

/*
  GET /photo/:filename
  Get photo with given name
    filename:   photo name
*/
router.get('/:filename', function (req, res, next) {
  // temporary public access to photos by filename
  //SecurityManager.verifyToken(req, res, function() {
    PhotoManager.getPhotoFile(req, res);
  //});
});

module.exports = router;