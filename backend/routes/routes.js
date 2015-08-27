var path = require('path'),
request = require('request'),
cheerio = require('cheerio'),
keys = require('../../keys.js'),
phantom = require('phantom'),
jsonData = require('../jsonData');
viewRoot = '';

exports.init = function(rootViewDirectory) {
  viewRoot = rootViewDirectory;
  return exports;
}

// ----------------------------
// ROUTES

/*
  / route
  Sends index,html file.
*/
exports.index = function(req, res) {
  res.sendFile(path.join(viewRoot, 'index.html'));
}

/* 
  /items route
  Gets items from JSON file
*/
exports.getItems = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData.items);
}

/*
  /champions route
  Gets champions from JSON file
*/
exports.getChampions = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.parse(jsonData.champions));
}

var itemArr = [];

/*
  /probuilds route
  Gets Pro build guide and sends data
*/
exports.proBuilds = function(req, res) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(req.body.value, function (status) {
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
