var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bCrypt = require('bCrypt-nodejs');

passport.serializeUser(function(user, done) {

});

passport.desreializeUser(function(username, done) {

});

passport.use('login', new LocalStrategy(
  function(username, password, done) {

}));

passport.use('register', new LocalStrategy(
  function(username, password, done) {

}));

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};
 
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = passport;