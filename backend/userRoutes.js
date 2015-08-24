var passport;
exports.init = function(pp) {
  passport = pp;
  return exports;
}

exports.logout = function(req, res, next){
  req.logout();
  res.end();
  console.log('Logged out');
}

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

exports.isLogged = function(req, res) {
  res.send(req.user ? req.user: '0');
}

exports.isAuth = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  return res.send({success: false});
}