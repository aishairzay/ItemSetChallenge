'use strict';

/* Controllers */

angular.module('app.controllers', []).
  run(function($rootScope, $http) {
    $rootScope.champions = [];
    $http.get('/champions')
      .success(function(data) {
          var champs = data.data;
           for(var key in champs){
            $rootScope.champions.push(champs[key]);
           }
           console.log($rootScope.champions);
      })
  }).
  controller('AppController', function($scope, $http) {

  }).
  controller('CreateController', function($scope, $http) {
    $scope.itemSearch = '';
    $scope.items = [];
    $scope.categories = [];
    $scope.category = "All";
    $http.get('/items')
      .success(function(data) {
        var items = data.data;
        for (var key in items) {
          if(items.hasOwnProperty(key)) {
            var obj = items[key];
            $scope.items.push(obj);
            $scope.categories = _.union($scope.categories, obj.tags);
          }
        }
      })
    $scope.searchItems = function(item){
      return $scope.itemSearch.length == 0 || item.name.toLowerCase().indexOf($scope.itemSearch.toLowerCase()) != -1
    }
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