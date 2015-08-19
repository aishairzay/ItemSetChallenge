var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
User = require('./user');
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

passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) { 
      // check in mongo if a user with username exists or not
      User.findOne({ 'username' :  username }, 
        function(err, user) {
          // In case of any error, return using the done method
          if (err)
            return done(err);
          // Username does not exist, log the error and redirect back
          if (!user){
            console.log('User Not Found with username '+username);
            return done(null, false, {info: 'User not found'});                 
          }
          // User exists but wrong password, log the error 
          if (!isValidPassword(user, password)){
            console.log('Invalid Password');
            return done(null, false, {info: 'Invalid Password'}); // redirect back to login page
          }
          // User and password both match, return user from done method
          // which will be treated like success
          return done(null, user, {info: 'success'});
        }
      );
}));

  passport.use('register', new LocalStrategy({
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

      // find a user in mongo with provided username
      User.findOne({ 'username' :  username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists with username: '+username);
          return done(null, false);
        } else {
          // if there is no user, create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log(newUser.username + ' Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    })
  );

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};
 
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = passport;