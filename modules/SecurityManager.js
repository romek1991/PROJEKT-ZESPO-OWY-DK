/*
  SECURITY MANAGER
  Module responsible for authentication of users based on JWT tokens
*/

var jwt = require('jsonwebtoken');
var User = require('../models/user');

var UserManager = require('../modules/UserManager');

/*
  Verifies if provided token is correct
*/
exports.verifyToken = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {  // alternative token location
    token = req.body.token;
  }

  if (!token) {
    console.log('[SecurityManager.verifyToken] No token provided.');
    return res.status(403).send({
      message: "No token provided."
    });
  } else {
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {      
      if (err) {
        console.log('[SecurityManager.verifyToken] Bad token provided.');
        return res.status(403).json({
          message: 'Failed to authenticate token.'
        });
      } else {
        console.log('[SecurityManager.verifyToken] Authenticated user id ' + decoded.userId + ", isAdmin: " + decoded.isAdmin);
        
        UserManager.getUserById(decoded.userId, function(user) {
          if (user) {
            req.user = user;
            console.log("XXXXXXXXX: " + user.login);
            next();
          }
        });
      }
    });
  }
}

/*
  Verifies login and password, then returns token
*/
exports.login = function(req, res) {
  if (!req.body.login || !req.body.password) {
    return res.status(400).json({
      message: "Missing login or password."
    });
  }
  
  UserManager.getUserByLogin(req.body.login, function(user) {
    if (!user) {
      res.status(404).json({ message: 'Authentication failed. Cannot find user ' + req.body.login });
    } else if (user) {
   
      // check if password matches
      if (user.password !== req.body.password) {
        console.error('[SecurityManager.login] Wrong password for user ' + req.body.login);
        res.status(403).json({
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // if user is found and password is right
        // create a token
        console.log('user._id: ' + user._id);
        var token = jwt.sign({userId: user._id, isAdmin: user.admin}, req.app.get('superSecret'), {
          expiresIn: req.app.get('tokenExpiresIn')
        });

        // return the information including token as JSON
        console.log('[SecurityManager.login] User ' + user.login + ' logged in.');
        res.json({
          user: {
            id: user._id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            admin: user.admin
          },
          token: token
        });
      }   
    }
  });
}