var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('GET /signup');
  console.log('Creating sample user kozak');
  // create a sample user
  var kozak = new User({
    login: 'kozak',
    password: 'pass',
    email: 'koz@kiewicz.pl',
    firstName: 'Michał',
    lastName: 'Kozakiewicz',
    admin: true
  });

  // save the sample user
    kozak.save(function(err) {
      if (err) {
        if (err.code && err.code == 11000) {
          res.json({
            success: false,
            message: 'User already exists.'
          });
        } else {
          throw err;
        }
      } else {
        console.log('User saved successfully');
        res.json({ success: true });
      }
    });
});

router.post('/', function(req, res, next) {
  console.log('POST /signup');
  
  var body = req.body;
  var newUser = new User({
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  
  newUser.save(function(err) {
    if (err) {
        if (err.code && err.code == 11000) {  // unique constraint violation
          res.json({
            success: false,
            message: 'User already exists.' + err
          });
        } else {
          throw err;
        }
      } else {
        console.log('User saved successfully');
        res.json({ success: true });
      }
  });
});

module.exports = router;
