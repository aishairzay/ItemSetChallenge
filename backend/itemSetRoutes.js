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
  if (!req.user || typeof req.user.username == undefined){
    console.log('Not logged in');
    res.send({success:false});
  } else{
    if(!req.body.itemSetId) {
      req.body.itemSetId = '';
    }
    console.log("Looking for itemSetId:", req.body.itemSetId);
    itemSet.findOne({_id:req.body.itemSetId}, function(err, itemS) {
      if (err || itemS.user != req.user.username) {
        // Create new item set attached to the current user
        var newItemSet = new itemSet({
          user: req.user.username,
          title: req.body.title,
          type: req.body.type,
          map: req.body.map,
          mode: req.body.mode,
          priority: req.body.priority,
          sortrank: req.body.sortrank,
          blocks: req.body.blocks,
          viewCount: 1,
          downloadCount: 1
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
      else {
        // Update existing user's item set
        itemS.title = req.body.title;
        itemS.type = req.body.type;
        itemS.map = req.body.map;
        itemS.mode = req.body.mode;
        itemS.priority = req.body.mode;
        itemS.sortrank = req.body.sortrank;
        itemS.blocks = req.body.blocks;
        itemS.save(function(err){
          if (err) {
            res.send({success:false});
          }
          else {
            res.send({success:true});
          }
          console.log('item set updated successfully');
        });
      }
    });
  }
}

exports.incrementViewCount = function(req, res) {
    var id = req.params.id;

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
            itemSet.viewCount = itemSet.viewCount + 1;
            itemSet.save();
            res.send({success:true});
          }
        }
      });
}

exports.incrementDownloadCount = function(req, res) {
    var id = req.params.id;

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
            itemSet.downloadCount = itemSet.downloadCount  + 1;
            itemSet.save();
            res.send({success:true});
          }
        }
      });
}

// delete /item-set/:id
exports.deleteItemSet = function(req, res) {
    
}