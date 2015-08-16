'use strict';

// Declare app level module which depends on filters, and services
// Defines app module
angular.module('app', [
  'app.controllers', 'app.directives', 'checklist-model'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider

  // Sets routes and
  // Decides which html file to load up in the main part of the view
  .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'HomeController'
  })
  .when('/item-set/create', {
    templateUrl: 'templates/item-set-create.html',
    controller: 'CreateController'
  })
  .when('/item-set/:id/view', {
    templateUrl: '/templates/item-set-view.html',
    controller: 'ItemSetViewController'
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