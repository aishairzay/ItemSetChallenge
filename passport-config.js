var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bCrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, done) {
  console.log('serializing: ' + user.username);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findbyId(id, function(err, user) {
    console.log('deserializing: ' + user.username);
    done(err, user);
  });
});

passport.use('login', new LocalStrategy(
  function(username, password, done) {
    User.findOne({'username': username}, function(err, user) {
      if(err) {
        return done(err);
      }

      if(!user){
        console.log('Username is not found!');
        done(null, false);
      }

      if(!isValidPassword(user, password)){
        console.log('Invalid Password');
        done(null, false);
      }

      return done(null, user);
    });
}));

passport.use('register', new LocalStrategy(
  function(username, password, done) {
    User.findOne({'username': username}, function(err, user) {
      if(err){
        return done(err);
      }

      if(user){
        console.log('Username is taken bruh');
        return done(null, false);
      } else {

        //creates new user
        var newUser = new User();

        newUser.username = username;
        newUser.password = createHash(password);

        newUser.save(function(err) {
          if(err){
            console.log('Error');
            throw err;
          }
          console.log(newUser.username + ' Registration successful');
          return done(null, newUser);
        });
      }
    });

}));

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};
 
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = passport;