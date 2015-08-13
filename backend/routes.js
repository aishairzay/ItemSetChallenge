var path = require('path');
var viewRoot = '';

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

}
// delete /item-set/:id
exports.deleteItemSet = function(req, res) {

}