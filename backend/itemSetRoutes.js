var itemSet = require('../itemSetSchema.js');


exports.init = function() {
  return exports;
}

// Itemset routes
// get /item-set/:id
exports.getItemSet = function(req, res) {
  
}
// post /item-set
exports.createItemSet = function(req, res) {
  if(typeof req.user.username == 'undefined'){
    console.log('Not logged in');
  }else{
    var newItemSet = new itemSet({
      user: req.user.username,
      title: req.body.title,
      type: req.body.type,
      map: req.body.map,
      mode: req.body.mode,
      priority: req.body.priority,
      sortrank: req.body.sortrank,
      blocks: req.body.blocks
    });

    newItemSet.save(function(err){
      if (err) return err;
      console.log('item set saved successfully');
    });
  }
}
// delete /item-set/:id
exports.deleteItemSet = function(req, res) {

}