var User = require('../models/user');

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