'use strict';

/* Controllers */

angular.module('app.controllers', ['checklist-model', 'ngDragDrop', 'ngCookies']).
run(function($rootScope, $http, $location, $routeParams, $timeout) {
  $rootScope.pageError = '';
  $rootScope.pageSuccess = '';

  /*$rootScope.refreshMyBuilds = function() {
    console.log("Yo");
    $http.get('/item-set/user')
      .then(function(data) {
        console.log("data", data);
      }, function(res) {

      });
  }*/
  $http.get('/isLogged')
    .then(function(userdata) {
      if(userdata.data != 0){
        $rootScope.isAuthenticated = true;
        $rootScope.currentUser = userdata.data.username;
      }else{
        $rootScope.isAuthenticated = false;
        $rootScope.currentUser = '';
      }
    })

  $rootScope.setPageError = function(str) {
    $rootScope.pageError = str;
    $timeout(
      function(){
        $rootScope.pageError = '';
      }, 5000);
  }
  $rootScope.setPageSuccess = function(str) {
    $rootScope.pageSuccess = str;
    $timeout(
      function(){
        $rootScope.pageSuccess = '';
      }, 5000);
  }

  //navbar button functions
  $rootScope.rootLogout = function(){
    $rootScope.isAuthenticated = false;
    $rootScope.currentUser = '';
    $rootScope.setPageSuccess('You have been logged out');

    // no need for log out route, the cookie is the only thing that really matter
    $http.get('/logout').then(function(data){
      $location.path('/');
    })
  }

  //load champions on any page
  $rootScope.champions = [];
  $http.get('/champions')
  .then(function(data) {
    var champs = data.data.data;
    for(var key in champs){
      $rootScope.champions.push(champs[key]);
    }
  }, function(result) {
    $rootScope.setPageError('Something went wrong loading champions, refresh to try again');
  })
}).
controller('AppController', function($scope, $http) {

}).
controller('CreateController', function($rootScope, $scope, $http, $routeParams, $location) {
  var id = $routeParams.id;

  if(id && id.length > 0){
    $http.post('/item-set/' + id + '/view');
  }

  $http.get('/item-set/' + id)
  .then(function(data) {
    if(data.data.success && data.data.itemSet) {
      if($scope.lists.items.length == 0) {
        $scope.$on('itemsLoaded', function() {
          $scope.initialize(data.data.itemSet);
        })
      }
      else {
       $scope.initialize(data.data.itemSet);
     }
   }
   else if(data.data.success){
        // Do nothing
      }
      else {
        $rootScope.setPageError('Could not find specified item-set');
      }
    }, function(response) {
      $rootScope.setPageError('Could not find specified item-set');
    });

  $scope.lists = {
    "blocks":[],
    "items":[]
  };

  $scope.fixName = function(name) {
    var newStr = '';
    for (var i in name) {
      var c = name[i]
      if (c == c.toUpperCase()) {
        newStr += ' ';
      }
      newStr += c;
    }
    return newStr;
  }

    // Item controls
    $scope.lists.items = [];
    $scope.itemSearch = ''; 
    $scope.categories = [];
    $scope.category = 'All';
    $scope.searchItems = function(item){
      return $scope.itemSearch.length == 0 || item.toLowerCase().indexOf($scope.itemSearch.toLowerCase()) != -1;
    }
    $scope.changeSelectedCategory = function(category) {
      $scope.category = category;
    }
    $scope.inRightCategory = function(categories) {
      return ($scope.category == 'All' || _.contains(categories, $scope.category));
    }
    $http.get('/items')
    .then(function(data) {
      var items = data.data.data;
      for (var key in items) {
        if(items.hasOwnProperty(key)) {
          var obj = items[key];
          $scope.lists.items.push(obj);
          $scope.categories = _.union($scope.categories, obj.tags);
        }
      }
      $scope.$broadcast('itemsLoaded', {});
      $scope.loading = false;
    }, function(res) {
      $scope.pageError = 'Something went wrong, please refresh';
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
    $scope.loading = true;
    $scope.itemSetData = {};
    $scope.uploadedFileText = '';
    $scope.itemSetMode = 'Any';
    $scope.itemSetMaps = 'Any';
    $scope.textFile = null
    $scope.makeTextFile = function (text) {
      var data = new Blob([text], {type: 'text/plain'});
      if ($scope.textFile !== null) {
        window.URL.revokeObjectURL($scope.textFile);
      }
      $scope.textFile = window.URL.createObjectURL(data);
    };

    $('#item-upload-wrapper').on('change', '#item-set-data-file', function(evt) {
      var input = evt.target;
      var reader = new FileReader();
      reader.onload = function(){
        var result = reader.result;
        $scope.uploadedFileText = result;
      };
      reader.readAsText(input.files[0]);
    });


    $scope.upload = function(value, method) {
      if (method == 'file') {
        var data = JSON.parse($scope.uploadedFileText);
        var clean = true;
        // check if data is good -> aka has all the appropriate things we want
        if (data.map && data.title && data.blocks) {
          for (var i = 0;i<data.blocks.length;i++) {
            var block = data.blocks[i];
            if(block.type && block.items) {
              for (var j = 0;j<block.items.length;j++) {
                var item = block.items[j];
                if(!item.id || !item.count) {
                  clean = false;
                  break;
                }
              }
            }
            else{
              clean = false;
              break;
            }
          }
        }
        else{
          clean = false;

        }
        if (clean) {
          $scope.initialize(data);
          $rootScope.setPageSuccess('Your file has been uploaded');
        }
        else{
          $rootScope.setPageError('There was a problem parsing the uploaded file. Make sure you have uploaded a JSON file with all item set fields.');
        }
        $('#uploadModal').modal('toggle');
        //$scope.data = goodData;
      }
      else if (method == 'probuild') {
        $http.post('/probuilds', {'value': value})
        .then(function(res){
          $scope.initialize(proBuildsObj(res));
        })
      }
    }

    var proBuildsObj = function(response){

      var blocks = [];

      var items = [];

      var obj = {
        title: response.data.title,
        map: "any",
        blocks: blocks
      }

      for(var i = 0, j = 0; i < response.data.itemArr.length; i++){
        if(response.data.itemArr[i] > 0){
          var itemObj = {
            id: '',
            count: 1
          }

          itemObj.id = response.data.itemArr[i];
          items.push(itemObj); 

        } else {
          j++;
          var blocksObj = {
            type: '',
            recMath: false,
            minSummonerLevel: -1,
            maxSummonerLevel: -1,
            showIfSummonerSpell: '',
            hideIfSUmmonerSpell: '',
            items : items
          };
          blocksObj.type = j.toString();
          blocks.push(blocksObj);
          items = [];
        }
      }
      return obj;
      console.log(obj);
    }

    $scope.submit = function(maps, champs) {
      console.log(maps, champs);
    }

    $scope.download = function (filename, text) {
      if(id && id.length > 0){
        $http.post('/item-set/' + id + '/download');
      }
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
      $scope.download($scope.itemSetTitle + '.json', JSON.stringify(data));
    }
    $scope.save = function() {
      var data = $scope.buildObj();
      data.itemSetId = id;
      $http.post('/item-set', data)
      .then(function(data) {
        console.log("data", data);
        if (data.data.success) {
          $location.path( "/" );
          $rootScope.setPageSuccess('Your item set has been successfully saved');
        }
        else {
          $rootScope.setPageError('Something went wrong, please refresh and try again');
        }
      }, function(result) {
        $rootScope.setPageError("Something went wrong, please refresh and try again");
      });
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
      $scope.lists.blocks = [];
      for (var i = 0; i < data.blocks.length; i++) {
        var block = data.blocks[i];
        var items = [];
        for (var j = 0; j < block.items.length; j++) {
          var item = block.items[j];
          for (var k = 0; k < $scope.lists.items.length; k++){
            var curRealItem = $scope.lists.items[k];
            var id = curRealItem.id;
            if(item.id == id) {
              for(var n = 0; n < item.count; n++ ) {
                items.push(curRealItem);
              }
              break;
            }
          }
        }
        $scope.lists.blocks.push({
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
            blockItems.push({id:item.id.toString(), count:1});
          }
          else{
            blockItems[index].count = blockItems[index].count + 1;
          }
        }
        var block = {
          'type': type,
          'recMath': false,
          'minSummonerLevel': -1,
          'maxSummonerLevel':-1,
          'showIfSummonerSpell':"",
          'hideIfSummonerSpell':"",
          'items': blockItems
        };
        blocks.push(block);
        count = count + 1;
      }
      var title = $scope.itemSetTitle;
      if(!title){
        title = 'UnnamedItemSet'
      }

      var data = {
        title: title,
        type:'custom',
        map:map,
        mode:'any',
        priority: false,
        sortrank: 0,
        blocks: blocks
      };
      return data;
    }
  }).
controller('HomeController', function($scope, $http) {

}).
controller('ItemSetViewController', function($scope, $http) {

}).
controller('AuthCtrl', function($scope, $http, $location, $rootScope) {
  $scope.user = {
    username: '',
    password: ''
  };

  $scope.newUser = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  $scope.warning = '';

  $scope.clearLoginPage = function() {
    $scope.loginError = '';
    $scope.registerError = '';
    $scope.newUser.password = '';
    $scope.newUser.confirmPassword = '';
    $scope.newUser.username = '';
    $scope.user.username = '';
    $scope.user.password = '';
  }

  $scope.login = function(){
    $http.post('/login', $scope.user)
    .then(function(data){
      if(data.data.info === 'success'){
        $rootScope.isAuthenticated = true;
        $rootScope.currentUser = data.data.user.username;
        $('#loginModal').modal('toggle');
        $scope.clearLoginPage();
        $rootScope.setPageSuccess('You are now logged in');
      } else {
        $scope.loginError = 'Invalid Login Information';
      }
    }, function(response) {
      $scope.loginError = 'Something went wrong, refresh the page and try again';
    });
  };
  $scope.register = function(){
    if($scope.newUser.username.length < 4){
      $scope.registerError = 'Username must be longer than 4 characters';
    }
    else if($scope.newUser.password.length < 5){
      $scope.registerError = 'Password must be longer than 5 characters';
    } 
    else if($scope.newUser.password == $scope.user.username){
      $scope.registerError = 'Password cannot be the same as username';
    }
    else if ($scope.newUser.password != $scope.newUser.confirmPassword){
      $scope.registerError = 'Passwords do not match';
    }
    else {
      $http.post('/register', $scope.newUser)
      .then(function(data){
        $('#loginModal').modal('toggle')
        if(data.data.success){
          var user = $scope.newUser;
          $rootScope.isAuthenticated = true;
          $rootScope.currentUser = user.username;
          $scope.clearLoginPage();
          $rootScope.setPageSuccess('You are now logged in');
        }
      }, function(response) {
        $scope.registerError = 'Something went wrong, refresh the page and try again';
      });
    } 
  }
}).
controller('SearchCtrl', function($scope, $http){
  $scope.itemList = [];
  $http.get('/getAllItems').then(function(response) {
    for(var i = 0; i < response.data.length; i++) {
      var item = {};
      item = response.data[i];
      $scope.itemList.push(item);
    }
  });
})
