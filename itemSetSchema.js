var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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
  downloadCount: Number
});

module.exports = mongoose.model('itemSet', itemSetSchema);