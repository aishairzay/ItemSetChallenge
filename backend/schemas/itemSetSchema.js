var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*
  Defines schema for an item set in the mongo database
*/

var itemSetSchema = new Schema({
  //maybe add user info
  date_created: {type: Date, default: Date.now()},
  user: String,
  title: String,
  type: String,
  map: String,
  mode: String,
  priority: Boolean,
  sortrank: Number,
  blocks: [Schema.Types.Mixed],
  viewCount: Number,
  downloadCount: Number,
  allChamps: Boolean,
  champions: [String]
});

module.exports = mongoose.model('itemSet', itemSetSchema);