var User = require('../models/user');

exports.getUser = function(login) {
  User.findOne({
    login: login
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      console.error('[UserManager] Cannot find user with login: ' + login);
      return null;
    } else if (user) {
      console.log('[UserManager] Returning user: ' + user);
      return user;
    }
  });
}