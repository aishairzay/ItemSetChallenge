'use strict';

// Declare app level module which depends on filters, and services
// Defines app module
angular.module('app', [
  'app.controllers', 'app.directives', 'ngRoute', 'ngCookies'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider
  // Sets routes and
  // Decides which html file to load up in the main part of the view
  .when('/', {
    templateUrl: 'templates/item-set-search.html',
    controller: 'SearchCtrl'
  })
  .when('/item-set/create/:id?', {
    templateUrl: '/templates/item-set-create.html',
    controller: 'CreateController'
  })
  .otherwise({
    redirectTo: '/'
  });

  // not working..?
  // Changes it so there is no # in the url bar as long as html5 is supported by the browser
  if(window.history && window.history.pushState) {
    //$locationProvider.html5Mode(true);
  }
});