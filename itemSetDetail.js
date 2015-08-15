var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSetSchema = new Schema({
  //maybe add user info
  date_created: {type: Date, default: Date.now()}
  item_set: {
    title: String,
    type: String,
    map: String,
    mode: String,
    priority: boolean,
    sortrank: String,
    blocks: [
      //Array of blocks
    ]
  }
});