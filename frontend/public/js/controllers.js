'use strict';

/* Controllers */

angular.module('app.controllers', []).
  run(function($rootScope, $http) {
    $http.get('/champions')
      .success(function(data) {
        //do something 
      })
  }).
  controller('AppController', function($scope, $http) {

  }).
  controller('CreateController', function($scope, $http) {
    $scope.items = [];
    $scope.categories = [];
    $scope.category = "All";
    $http.get('/items')
      .success(function(data) {
        var items = data.data;
        console.log("All items", items);
        for (var key in items) {
          if(items.hasOwnProperty(key)) {
            var obj = items[key];
            $scope.items.push(obj);
            $scope.categories = _.union($scope.categories, obj.tags);
          }
        }
      })

    $scope.changeSelectedCategory = function(category) {
      console.log("Changed category:", category);
      $scope.category = category;
    }
    $scope.inRightCategory = function(categories) {
      return ($scope.category == "All" || _.contains(categories, $scope.category));
    }
  }).
  controller('HomeController', function($scope, $http) {

  }).
  controller('ItemSetViewController', function($scope, $http) {

  });