var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var multer  = require('multer')

var avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img');
  },
  filename: function (req, file, cb) {
    cb(null, req.body.username);
  }
});

var upload = multer({ dest: './uploads/', storage: avatarStorage });

// var User = require('../models/user');
// var Trip = require('../models/trip');
// var Comment = require('../models/comment');

// var TripManager = require('../modules/TripManager');
// var UserManager = require('../modules/UserManager');
// var SecurityManager = require('../modules/SecurityManager');

// router.use(function(req, res, next) {
//   SecurityManager.verifyToken(req, res, next);
// });

/*
  POST /avatar
  Add new avatar for current user
*/
router.post('/avatar', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.body);
  console.log(req.user);
  console.log(req.file);
  
  res.status(200).redirect('/#/profile/');
})

module.exports = router;