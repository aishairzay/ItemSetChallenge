var path = require('path'),
request = require('request'),
cheerio = require('cheerio'),
keys = require('../keys.js'),
phantom = require('phantom'),
jsonData = require('../jsonData');
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
  //request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=from,gold,groups,into,maps,sanitizedDescription,stats,tags,tree&api_key='+ keys.RIOT_API_KEY, function(err, resp, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonData.items);
  //});
}

exports.getChampions = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.parse(jsonData.champions));
  /*
  request('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=tags&api_key=' + keys.RIOT_API_KEY, function(err, resp, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
*/
}

var itemArr = [];

exports.proBuilds = function(req, res) {
phantom.create(function (ph) {
  ph.createPage(function (page) {
    page.open(req.body.value, function (status) {
      console.log("opened " + req.body.value, status);
      page.evaluate(function () { 
        return [document.body.innerHTML, document.title]; 
      }, function (result) {
        var $ = cheerio.load(result[0]);
        $('li', '.buy-order').each(function(){
          var x = $(this).attr('data-item');
          itemArr.push(x);
        });
        ph.exit();
        for(var i = 0; i < itemArr.length; i++) {
         if (typeof itemArr[i] == 'undefined') {
          itemArr[i] = 0;
         }else{
          itemArr[i] = itemArr[i];
         }
        }
        res.send({'itemArr': itemArr, 'title': result[1]});
      });
    });
  });
});
}
