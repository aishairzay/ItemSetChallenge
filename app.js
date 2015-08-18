var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('./passport-config.js');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var viewRoot = path.join(__dirname, 'frontend/views');
var routes = require(path.join(__dirname, 'backend', 'routes')).init(viewRoot);
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

app.get('/champions', routes.getChampions);

app.get('/items', routes.getItems);

app.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      console.log('failed');
      return res.redirect('#/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      console.log("signed in");
      return res.redirect('/');
    });
  })(req, res, next);
});

app.post('register', passport.authenticate('register', { successRedirect: '/',
                                                    failureRedirect: '/register' }));

app.get('*', routes.index);

// Starts server
http.listen(8080, function() {
  console.log('Listening on port 8080');
});