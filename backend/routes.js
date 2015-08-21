var path = require('path'),
request = require('request'),
keys = require('../keys.js'),
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
