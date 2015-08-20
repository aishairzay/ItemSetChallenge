var path = require('path'),
request = require('request'),
keys = require('../keys.js'),
itemSet = require('../itemSetSchema.js'),
viewRoot = '';

exports.init = function(rootViewDirectory) {
  viewRoot = rootViewDirectory;
  return exports;
}

// ----------------------------
// ROUTES
exports.index = function(req, res) {
  res.sendFile(path.join(viewRoot, 'index.html'));
}

// Itemset routes
// get /item-set/:id
exports.getItemSet = function(req, res) {

}
// post /item-set
exports.createItemSet = function(req, res) {
  if(!req.user.username){
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

// Item routes
exports.getItems = function(req, res) {
  request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=from,gold,groups,into,maps,sanitizedDescription,stats,tags,tree&api_key='+ keys.RIOT_API_KEY, function(err, resp, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
}

exports.getChampions = function(req, res) {
  request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=tags&api_key=' + keys.RIOT_API_KEY, function(err, resp, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
}
exports.logout = function(req, res, next){
  req.logout();
  res.redirect('/');
}