var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var viewRoot = path.join(__dirname, 'frontend\\views');
var routes = require(path.join(__dirname, 'backend', 'routes')).init(viewRoot);

// Setup
app.set('views', path.join(__dirname, 'frontend', 'views'));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Routes
app.get('/', routes.index);
app.get('*', routes.index);

// Starts server
http.listen(8080, function() {
  console.log('Listening on port 8080');
});