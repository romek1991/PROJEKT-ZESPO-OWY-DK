/*
  USER MANAGER
  Module contains wrappers for database operations and business logic for user profiles and accounts
*/

var User = require('../models/user');

exports.signup = function(req, res) {
  if (!req.body.login || !req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName) {
    return res.status(400).json({
      message: "Request must consist of parameters: login, password, email, firstName, lastName."
    })
  }
  
  console.log('[UserManager.signup] login: ' + req.body.login );
  
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
          res.status(409).json({
            message: 'User already exists.' + err
          });
        } else {
          throw err;
        }
      } else {
        console.log('User saved successfully');
        res.status(200).send();
      }
  });
}

exports.getUserByLogin = function(login, next) {
  User.findOne({
    login: login
  }, function(err, user) {

    if (err) {
      console.error("[UserManager.getUserByLogin] ERROR: " + err);
      next(null);
    } else {
      if (!user) {
        console.error('[UserManager.getUserByLogin] Cannot find user with login: ' + login);
        next(null);
      } else {
        console.log('[UserManager.getUserByLogin] Found user with login ' + login);
        next(user);
      }
    }
  });
}

exports.getUserById = function(id, next) {
  User.findById(id, function(err, user) {
    if (err) {
      console.error("[UserManager.getUserById] ERROR: " + err);
      next(null);
    } else {
      if (!user) {
        console.error('[UserManager.getUserById] Cannot find user with id: ' + id);
        next(null);
      } else {
        console.log('[UserManager.getUserById] Found user with id ' + id);
        next(user);
      }
    }
  });
}