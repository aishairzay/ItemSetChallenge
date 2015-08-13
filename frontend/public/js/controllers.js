'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('AppController', function($scope, $http) {

  }).
  controller('CreateController', function($scope, $http) {
  	$http.get('/api/getItems')
  		.success(function(data) {
  			console.log(data);
  		})
  }).
  controller('HomeController', function($scope, $http) {

  }).
  controller('ItemSetViewController', function($scope, $http) {

  });