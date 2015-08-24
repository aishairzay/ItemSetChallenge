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
  console.log('Logged out');
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
      console.log('Login failed');
      return res.send(info); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      console.log("Signed in");
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
      console.log('Registration failed');
      return res.send(info);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log("Registered and Logged In");
      return res.send({success:true});
    });
    
  })(req, res, next);
}

/*
  /user/is-logged-in
  Checks whether or not a user is logged in based on the request.
*/
exports.isLogged = function(req, res) {
  console.log("GOT REQUEST TO CHECK");
  res.send(req.user ? req.user: '0');
}


exports.isAuth = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  return res.send({success: false});
}