var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('./passport-config.js');
var itemSet = require('./backend/schemas/itemSetSchema');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var cheerio = require('cheerio');
var phantom = require('phantom');
var viewRoot = path.join(__dirname, 'frontend/views');

//var api = require('./backend/api');
// Setup
app.set('views', path.join(__dirname, 'frontend', 'views'));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data

//passport configuration
app.use(session({ secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
//app.use('/api', api);

// Database connection
// run mongo with mongod --dbpath=C:\data on my machine

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/item-set-challenge');

var routes = require(path.join(__dirname, 'backend', 'routes', 'routes')).init(viewRoot);
var userRoutes = require(path.join(__dirname, 'backend', 'routes', 'userRoutes')).init(passport);
var itemSetRoutes = require(path.join(__dirname, 'backend', 'routes', 'itemSetRoutes')).init(mongoose);

/**
collections to use:
items
  Stores all items given from the Riot API call
item-sets
  Stores list of item-sets
*/

// Routes

// Item set related routes
app.get('/item-set/user', userRoutes.isAuth, itemSetRoutes.getSavedItemSets);
app.post('/item-set/search', itemSetRoutes.searchItemSets);
app.get('/item-set/:id', itemSetRoutes.getItemSet);
app.post('/item-set', userRoutes.isAuth, itemSetRoutes.createItemSet);
app.delete('/item-set/:id', userRoutes.isAuth, itemSetRoutes.deleteItemSet);
app.post('/item-set/:id/view', itemSetRoutes.incrementViewCount);
app.post('/item-set/:id/download', itemSetRoutes.incrementDownloadCount);

// User related routes
app.post('/user/login', userRoutes.login);
app.post('/user/register', userRoutes.register);
app.get('/user/logout', userRoutes.logout);
app.get('/user/is-logged-in', userRoutes.isLogged);

// General purpose routes / RIOT API calls
app.get('/champions', routes.getChampions);
app.get('/items', routes.getItems);
app.post('/probuilds', routes.proBuilds);

app.get('*', routes.index);

// Starts server
http.listen(8080, function() {
  console.log('Listening on port 8080');
});