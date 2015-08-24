var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*
  Defines schema for users in the mongo database
*/

var userSchema = new Schema({
  
  username: String,
  password: String

});

module.exports = mongoose.model('User', userSchema);