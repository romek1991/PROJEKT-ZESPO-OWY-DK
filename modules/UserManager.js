/*
  USER MANAGER
  Module contains wrappers for database operations and business logic for user profiles and accounts
*/

var PhotoManager = require('../modules/PhotoManager');

var User = require('../models/user');
var Trip = require('../models/trip');

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
        
        // set default avatar
        PhotoManager.defaultAvatar(req.body.login);
        
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



exports.removeUser = function(req, res){

    console.log('findTripByID: ' + req.body.id);
    console.log('remove trip - trip id: ' + req.tripId);
    var currentUserId;
    console.log('req.user.login: ' + req.user.login);
    console.log('req.login: ' + req.login);
    if(req.user.login == req.login){
      User.findOne({login: req.login}, function(err, user){
        console.log('looking for user: '+ user);
        currentUserId = user._id;
        typeof user;

        console.log('current user id: ' + user._id);

        Trip.find({author: currentUserId}, 'id name createdDate startDate endDate publicAccess', function(err, userTrips) {
              console.log(userTrips);
              console.log("/////////////////////////");
              userTrips.forEach(function(entry){
                Trip.findOneAndRemove({ _id: entry._id }, function(err){
                  console.log('Trip removed successfully.');
                });

              });

              User.findOneAndRemove({login: req.login}, function(err){
                console.log('Trip removed successfully.');
                console.log('Error message: ' + err);

              });
              res.json({
                message: "The user and its trips has been removed."
              });

            }
        );
      });
    }
    else {
      res.status(403).json({
        message: "Not authorized."
      });

    }
};

exports.updateUser = function(req, next){
    User.findByIdAndUpdate(req.body.id,
        { $set: {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            //login:req.body.login,     - nie chcemy zeby login sie zmienial
            email:req.body.email
            }
        },
        function(err, user) {

        if (err) {
            console.log(user);
            console.log('cossiedzieje1');
            next(null);
        } else {
            console.log('cossiedzieje');
            next(user);
        }
    });
};

exports.searchUsers = function(searchString, next) {
  if (searchString=="") {
    next([]);
  } else {
    User
      .find({$or:[
        {firstName: new RegExp('.*'+searchString+'.*', "i")},
        {lastName: new RegExp('.*'+searchString+'.*', "i")}
      ]})
      .exec(function(err, users){
        if (err) throw err;
        next(users);
      });
  }
  
};
