'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('AppController', function($scope, $http) {

  }).
  controller('CreateController', function($scope, $http) {
  	$scope.items = {};
    $http.get('/api/getItems')
  		.success(function(data) {
  			for(var stuff in data){
  				$scope.items[stuff] = data[stuff];
  			}
  		})
  }).
  controller('HomeController', function($scope, $http) {

  }).
  controller('ItemSetViewController', function($scope, $http) {

  });