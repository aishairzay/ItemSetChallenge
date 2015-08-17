'use strict';

/* Controllers */

angular.module('app.controllers', ['checklist-model', 'dndLists']).
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
  controller('CreateController', function($rootScope, $scope, $http) {
    $scope.lists = {
      "blocks":[],
      "items":[]
    };
    $scope.itemSetMode = 'Any';
    $scope.itemSetMaps = 'Any';
    $scope.champFilter = 'All';
    $scope.championView = 'All';
    $scope.checked = false;
    $scope.champs = [];
    $scope.lists.blocks = [{}];
    $scope.itemSearch = '';
    $scope.championSearch = '';
    $scope.lists.items = [];
    $scope.categories = [];
    $scope.category = 'All';
    $http.get('/items')
      .success(function(data) {
        var items = data.data;
        for (var key in items) {
          if(items.hasOwnProperty(key)) {
            var obj = items[key];
            $scope.lists.items.push(obj);
            $scope.categories = _.union($scope.categories, obj.tags);
          }
        }
      })
    $scope.addNewBlock = function() {
      $scope.lists.blocks.push({});
    }
    $scope.searchItems = function(item){
      return $scope.itemSearch.length == 0 || item.name.toLowerCase().indexOf($scope.itemSearch.toLowerCase()) != -1;
    }
    $scope.changeSelectedCategory = function(category) {
      console.log("Changed category:", category);
      $scope.category = category;
    }
    $scope.inRightCategory = function(categories) {
      return ($scope.category == 'All' || _.contains(categories, $scope.category));
    }
    $scope.inRightChampCategory = function(categories) {
      return ($scope.champFilter == 'All' || _.contains(categories, $scope.champFilter));
    }
    $scope.submit = function(maps, champs){
      console.log(maps, champs);
    }
    $scope.searchChampions = function(champion) {
      return $scope.championSearch.length == 0 || champion.name.toLowerCase().indexOf($scope.championSearch.toLowerCase()) != -1;
    }
    $scope.checkAllChampions = function() {
      for(var key in $rootScope.champions) {
        var champion = $rootScope.champions[key];
        $scope.champs.push(champion.name);
      }
    }
    $scope.uncheckAllChampions = function() {
      $scope.champs.splice(0, $scope.champs.length);
    }
    $scope.checkAllCurrentChampions = function() {
      for(var key in $rootScope.champions) {
        var champion = $rootScope.champions[key];
        if($scope.champFilter == 'All' || _.contains(champion.tags, $scope.champFilter)) {
          if($scope.champs.indexOf(champion.name) == -1){
            $scope.champs.push(champion.name);
          }
        }
      }
    }
    $scope.uncheckAllCurrentChampions = function() {
      for(var key in $rootScope.champions) {
        var champion = $rootScope.champions[key];
        if($scope.champFilter == 'All' || _.contains(champion.tags, $scope.champFilter)) {
          var index = $scope.champs.indexOf(champion.name);
          if (index !== -1) {
              $scope.champs.splice(index, 1);
          }
        }
      }
    }
  }).
  controller('HomeController', function($scope, $http) {
    
  }).
  controller('ItemSetViewController', function($scope, $http) {

  });