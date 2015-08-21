var itemSet = require('../itemSetSchema.js');
var mongoose;
var Schema;

exports.init = function(m) {
  mongoose = m;
  Schema = mongoose.Schema;
  return exports;
}

// Itemset routes
// get /item-set/:id
exports.getItemSet = function(req, res) {

  res.setHeader('Content-Type', 'application/json');
  console.log("param", req.params);
  if (req.params.id == 'undefined') {
    console.log("HERE");
    res.send({success:true});
  }
  else{
    itemSet.findOne({_id:req.params.id},
      function (err, itemSet) {
        if(err){
          console.log("Did not find id");
          res.send({success:false});
        }
        else{
          if (!itemSet) {
            res.send({success:false});
          }
          else{
            res.send({success:true,itemSet:itemSet});
          }
        }
      });
  }
}
// post /item-set
exports.createItemSet = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (typeof req.user.username == undefined){
    console.log('Not logged in');
    res.send({success:false});
  } else{
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
      if (err) {
        res.send({success:false});
      }
      else {
        res.send({success:true});
      }
      console.log('item set saved successfully');
    });
  }
}
// delete /item-set/:id
exports.deleteItemSet = function(req, res) {

}