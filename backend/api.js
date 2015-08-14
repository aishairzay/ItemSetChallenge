var express = require('express'),
	request = require('request'),
	keys = require('../keys.js'),
	api_stem = 'https://na.api.pvp.net',
	router = express.Router();

router.get('/items', function(req, res) {
	request(api_stem+'/api/lol/static-data/na/v1.2/item?api_key='+ keys.RIOT_API_KEY, function(err, resp, body) {
		var data = JSON.stringify(body.data);
    console.log("body.data", body.data);
    res.setHeader('Content-Type', 'application/json');
		res.send(data);
	});
  res.send(JSON.stringify({bob:"dfadfj"}));
});

module.exports = router;