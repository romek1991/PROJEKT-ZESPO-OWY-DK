var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/', function(req, res, next) {
  console.log('POST /signup');

  var body = req.body;
  console.log(body);
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
