var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var viewRoot = path.join(__dirname, 'frontend/views');
var routes = require(path.join(__dirname, 'backend', 'routes')).init(viewRoot);
//var api = require('./backend/api');
// Setup
app.set('views', path.join(__dirname, 'frontend', 'views'));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));
//app.use('/api', api);

// Database connection
// run mongo with mongod --dbpath=C:\data on my machine
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/item-set-challenge');
/**
collections to use:
items
  Stores all items given from the Riot API call
item-sets
  Stores list of item-sets
*/

// Routes
app.get('/item-set/:id', routes.getItemSet);
app.post('/item-set', routes.createItemSet);
app.delete('/item-set/:id', routes.deleteItemSet);

app.get('/items', routes.getItems);

app.get('*', routes.index);

// Starts server
http.listen(8080, function() {
  console.log('Listening on port 8080');
});