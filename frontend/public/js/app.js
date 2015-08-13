'use strict';

// Declare app level module which depends on filters, and services

angular.module('app', [
  'app.controllers'
]).
config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'HomeController'
  })
  .when('/item-set/create', {
    templateUrl: 'templates/item-set-create.html',
    controller: 'CreateController'
  })
  .otherwise({
    redirectTo: '/'
  });
});