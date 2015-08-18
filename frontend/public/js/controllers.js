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
      })
  }).
  controller('AppController', function($scope, $http) {

  }).
  controller('CreateController', function($rootScope, $scope, $http) {
    $scope.lists = {
      "blocks":[],
      "items":[]
    };

    // Item controls
    $scope.lists.items = [];
    $scope.itemSearch = ''; 
    $scope.categories = [];
    $scope.category = 'All';
    $scope.searchItems = function(item){
      return $scope.itemSearch.length == 0 || item.name.toLowerCase().indexOf($scope.itemSearch.toLowerCase()) != -1;
    }
    $scope.changeSelectedCategory = function(category) {
      $scope.category = category;
    }
    $scope.inRightCategory = function(categories) {
      return ($scope.category == 'All' || _.contains(categories, $scope.category));
    }
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

    // Block controls
    $scope.lists.blocks = [];
    $scope.addNewBlock = function() {
      $scope.lists.blocks.push({
        'type':'', 
        'items':[]
      });
      }
    $scope.removeBlock = function(index) {
      $scope.lists.blocks.splice(index, 1);
    }

    // Champ controls
    $scope.champFilter = 'All';
    $scope.championView = 'All';
    $scope.champs = [];
    $scope.championSearch = '';
    $scope.inRightChampCategory = function(categories) {
      return ($scope.champFilter == 'All' || _.contains(categories, $scope.champFilter));
    }
    $scope.searchChampions = function(champion) {
      return $scope.championSearch.length == 0 || champion.name.toLowerCase().indexOf($scope.championSearch.toLowerCase()) != -1;
    }
    $scope.checkAllChampions = function() {
      for(var key in $rootScope.champions) {
        var champion = $rootScope.champions[key];
        if($scope.champs.indexOf(champion.name) == -1) {
          $scope.champs.push(champion.name);
        }
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

    // Other
    $scope.itemSetMode = 'Any';
    $scope.itemSetMaps = 'Any';
    $scope.textFile = null
    $scope.makeTextFile = function (text) {
      var data = new Blob([text], {type: 'text/plain'});
      if ($scope.textFile !== null) {
        window.URL.revokeObjectURL($scope.textFile);
      }
      $scope.textFile = window.URL.createObjectURL(data);
      return $scope.textFile;
    };
    
    $scope.submit = function(maps, champs){
      console.log(maps, champs);
    }

    $scope.download = function (filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));  
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    
    $scope.createDoc = function() {
      var data = $scope.buildObj();
      var str = JSON.stringify(data);
      console.log("str", str);
      console.log("type", typeof str);
      $scope.download($scope.itemSetTitle + '.json', JSON.stringify(data));
    }
    $scope.save = function() {
      var data = $scope.buildObj();
    }

    $scope.initialize = function(data) {
      $scope.itemSetTitle = data.title;
      var map = data.map;
      var itemSetMap = 'Any';
      if (map == 'SR') {
        itemSetMap = 'Summoners Rift';
      }
      else if (map == 'HA') {
        itemSetMap = 'Howling Abyss';
      }
      else if (map == 'TT') {
        itemSetMap = 'Twisted Tree Line';
      }
      else if (map == 'CS') {
        itemSetMap = 'Crystal Scar';
      }
      $scope.itemSetMaps = itemSetMap;
      for (var i = 0; i < data.blocks.length; i++) {
        var block = data.blocks[i];
        var items = [];
        for (var j = 0; j < block.items.length; j++) {
          var item = block.items[j];
          for (var k = 0; k < $scope.lists.items.length; k++){
            var curRealItem = $scope.lists.items[k];
            if(item.id == curRealItem.id) {
              for(var n = 0; n < item.count; n++ ) {
                item.push(curRealItem);
              }
              break;
            }
          }
        }
        $scope.blocks.push({
          'items' : items,
          'type' : block.type
        });
      }
    }

    $scope.buildObj = function() {
      var map = $scope.itemSetMaps;
      if (map == 'Summoners Rift') {
        map ="SR";
      }
      else if (map == 'Howling Abyss') {
        map = "HA";
      }
      else if (map == 'Twisted Tree Line') {
        map = "TT";
      }
      else if (map == 'Crystal Scar') {
        map = "CS";
      }
      else{
        map = 'any';
      }
      var blocks = [];
      var count = 1;
      for (var i = 0; i<$scope.lists.blocks.length; i++) {
        var cur = $scope.lists.blocks[i];
        var type="Block " + count;
        if(cur.items.length == 0){
          continue;
        }
        if (cur.type != '') {
          type = cur.type;
        }
        var blockItems = [];
        var items = cur.items;
        for (var n = 0; n<items.length; n++) {
          var item = items[n];
          var index = -1;
          for (var j = 0; j<blockItems.length; j++) {
            if(item.id == blockItems[j].id) {
              index = j;
            }
          }
          if(index == -1) {
            blockItems.push({id:item.id, count:1});
          }
          else{
            blockItems[index].count = blockItems[index].count + 1;
          }
        }
        var block = {
          'type': type,
          'items': blockItems
        };
        blocks.push(block);
        count = count + 1;
      }
      
      var data = {
        title:$scope.itemSetTitle,
        type:'custom',
        map:map,
        mode:'any',
        blocks: blocks
      };
      console.log("data", data);
      return data;
    }
  }).
  controller('HomeController', function($scope, $http) {
    
  }).
  controller('ItemSetViewController', function($scope, $http) {

  }).
  controller('AuthCtrl', function($scope, $http) {
    
  });