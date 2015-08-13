var express = require('express'),
	request = require('request'),
	api_key = require('../keys.js'),
	api_stem = 'https://na.api.pvp.net',
	router = express.Router();

router.get('/getItems', function(req, res) {
	request(api_stem+'/api/lol/static-data/na/v1.2/item'+api_key, function(err, resp, body) {
		var data = JSON.parse(body);
		res.send(data.data);
	});
});

module.exports = router;