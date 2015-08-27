var passport;

exports.init = function(pp) {
  passport = pp;
  return exports;
}

/*
  /user/logout route
  Logs out user
*/
exports.logout = function(req, res, next){
  req.logout();
  res.end();
}

/*
  /user/login route
  Logs in a user
*/
exports.login = function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { 
      return next(err);
    }
    if (!user) {
      return res.send(info); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.send(info);
    });
  })(req, res, next);
}

/*
  /user/register
  Registers a user
*/
exports.register = function(req, res, next) {
  passport.authenticate('register', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if(!user) {
      return res.send(info);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.send({success:true});
    });
    
  })(req, res, next);
}

/*
  /user/is-logged-in
  Checks whether or not a user is logged in based on the request.
*/
exports.isLogged = function(req, res) {
  res.send(req.user ? req.user: '0');
}

/*
  Checks if a user is curretly is logged in and allows the next function to run if so
*/
exports.isAuth = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  return res.send({success: false});
}