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
    priority: Boolean,
    sortrank: Number,
    blocks: [
      {
        type: String,
        recMath: Boolean,
        minSummonerLevel: Number,
        maxSummonerLevel: Number,
        showIfSummonerSpell: String,
        hideIfSummonerSpell: String,
        items: [
          {
            id: String,
            count: Number
          }
        ] 
      }
    ]
  }
});