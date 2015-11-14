var jwt = require('jsonwebtoken');

exports.verifyToken = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({
      message: "No token provided."
    });
  } else {
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.status(403).json({
          message: 'Failed to authenticate token.'
        });
      } else {
        console.log('[SecurityManager.verifyToken] Authenticated user ' + decoded.login);
        req.login = decoded.login;
        next();
      }
    });
  }
}