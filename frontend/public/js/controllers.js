'use strict';

/* Controllers */

angular.module('app.controllers', ['checklist-model', 'ngDragDrop', 'ngCookies', 'ngAnimate']).
run(function($rootScope, $http, $location, $routeParams, $timeout, authFact) {

  /*
    Sets variables related to a current user's logged in state
  */
  authFact.checkAuth().then(function(userdata){
   if(userdata.data != 0){
    $rootScope.isAuthenticated = true;
    $rootScope.currentUser = userdata.data.username;
  }else{
    $rootScope.isAuthenticated = false;
    $rootScope.currentUser = '';
  }
  });

  /**
    rootScope variable initialization
  */
  $rootScope.pageError = '';
  $rootScope.pageSuccess = '';

  /*
    RootScope functions
  */

  /*
    Allows nav-bar to know which tab is currently selected based on the url
  */
  $rootScope.isActive = function (viewLocation) {
    if(viewLocation == '/item-set/create' && $location.path().indexOf('create') != -1)
    {
      return true;
    }
    return viewLocation === $location.path();
  };

  /*
    Changes the url to the specified build path
    Also removes modals that could possibly be overlayed while clicking this.
    Used from any page through the "My Builds" section or in the browse page.
  */
  $rootScope.goToHref = function(id) {
    $('#myBuildModal').modal('hide');
    $location.path('item-set/create/' + id);
  }



  /*
    Functions to set alerts on the top of the page which go away after 5 seconds
  */
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


  /*
    Logs out the current user.
  */
  $rootScope.rootLogout = function(){
    $rootScope.isAuthenticated = false;
    $rootScope.currentUser = '';
    $rootScope.setPageSuccess('You have been logged out');
    authFact.logout()
    .then(function(data){
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
  // Using rootScope instead
}).
controller('CreateController', function($rootScope, $scope, $http, $routeParams, $location, $timeout) {

/*
  Code to run on loading of create page.
*/

  var id = $routeParams.id;

  if(id && id.length > 0) {
    $http.get('/item-set/' + id)
    .then(function(data) {
      if(data.data.success && data.data.itemSet) {
        $timeout(function() {
          if (!$scope.loading) {
            $scope.initialize(data.data.itemSet);
          }
          else {
            $scope.$on('itemsLoaded', function() {
              $scope.initialize(data.data.itemSet);
            });
          }
        });    
      }
      else if(data.data.success){
        rootScope.setPageError('Something is not working, please try again later');
      }
      else {
        $rootScope.setPageError('Could not find specified item-set');
      } 
    }, function(response) {
        $rootScope.setPageError('Could not find specified item-set');
      }
    );

    $http.post('/item-set/' + id + '/view');
  }


/*
  Variable Initialization
*/

  // Summary variables
  $scope.totalValue = 0;
  $scope.stats = [];
  
  // Item variables
  $scope.allItems = [];
  $scope.allItemsMap = {};
  $scope.itemMap = {};
  $scope.owner = '';

  if(!$scope.lists) {
    $scope.lists = {
      "blocks":[],
      "items":[]
    };
  }
  $scope.lists.blocks = [];

  // Item controls
  /*
    If not already created, initializes items and categories
  */
  if(!$scope.lists.items || !$scope.categories) {
    $scope.lists.items = [];
    $scope.itemSearch = ''; 
    $scope.categories = [];
    $scope.category = 'All';
    $http.get('/items')
      .then(function(data) {
        var items = data.data.data;
        for (var key in items) {
          if(items.hasOwnProperty(key)) {
            var obj = items[key];
            $scope.lists.items.push(obj);
            $scope.allItemsMap[obj.id] = obj;
            $scope.categories = _.union($scope.categories, obj.tags);
          }
        }
        $scope.$broadcast('itemsLoaded', {});
        $scope.loading = false;
      }, function(res) {
        $scope.pageError = 'Something went wrong, please refresh';
      });
  }


  /*
    Calculates summary values based on items placed in blocks 
  */
  $scope.refreshValues = function() {
    $timeout(function(){
      var totalValue = 0;
      var finalItems = [];
      $scope.allItems.splice(0, $scope.allItems.length);
      $scope.itemMap.length = 0;
      $scope.stats.splice(0, $scope.stats.length);
      var blocks = $scope.lists.blocks;
      for (var i=0; i<blocks.length;i++) {
        var block = blocks[i];
        var items = block.items;
        for(var j=0; j < items.length;j++) {
          var item = items[j];
          $scope.allItems.push(item.id);
          $scope.itemMap[item.id] = item;
          finalItems.push(item.id);
        }
      }
      
      var statMap = {};
      for(var i = 0; i<$scope.allItems.length; i++ ) {
        var itemNum = $scope.allItems[i];
        var item = $scope.allItemsMap[itemNum];
        if (item.from && item.from.length > 0) {
          var from = item.from;
          var value = item.gold.base;
          for(var j =0;j<from.length;j++){
            var id = from[j];
            if (!(id in $scope.itemMap)) {
              value = value + $scope.allItemsMap[id].gold.total;
            }
            else {
              delete $scope.itemMap[id];
              var idx = finalItems.indexOf(parseInt(id));
              if(idx != -1) {
                finalItems.splice(idx, 1);
              }
            }
          }
          totalValue = totalValue + value;
        }
        else {
          totalValue = totalValue + item.gold.total;
        }
      }
      for(var i = 0; i < finalItems.length; i++) {
        var itemId = finalItems[i];
        var item = $scope.allItemsMap[itemId];
        var stats = item.stats;
        for (var key in stats) {
          if (key in statMap) {
            statMap[key] = statMap[key] + stats[key];
          }
          else {
            statMap[key] = stats[key];
          }
        }
      }

      for (var key in statMap) {
        var obj = {name: key, value: statMap[key]};
        $scope.stats.push(obj);
      }
      $scope.totalValue = totalValue;
    }, 100);
  }

  $scope.$on('itemsLoaded', function() {
    if ($scope.lists.blocks == '') {
      $scope.addNewBlock(true);
    }
  });

  /*
    Functions used to adjust names of displayed stats after retrieved from the RIOT API
    for example:
      FlatAttackDamageMod -> Attack Damage
      CriticalStrike -> Critical Strike
  */
  $scope.fixName = function(name) {
    var newStr = '';
    if(name.substr(0,7) == 'Percent') {
      name = name.substr(7);
    }
    if(name.substr(0,4) == 'Flat') {
      name = name.substr(4);
    }
    if(name.substr(name.length-3) == 'Mod') {
      name = name.substr(0, name.length-3);
    }
    for (var i in name) {
      var c = name[i]
      if (c == c.toUpperCase()) {
        newStr += ' ';
      }
      newStr += c;
    }
    return newStr;
  }

  /*
    Adjusts all stats to display with a percentage if necessary, and roudnm to two decimal points
  */
  $scope.fixStat = function(name, stat) {
    if (name.indexOf('CritChance') != -1 || name.substr(0,7) == 'Percent') {
      return +((stat * 100).toFixed(2)) + '%';
    }
    else {
      return +(stat.toFixed(2));
    }
  }

  /*
    Functions used to filter through items in the item-search pane
  */
  $scope.searchItems = function(item){
    return $scope.itemSearch.length == 0 || item.toLowerCase().indexOf($scope.itemSearch.toLowerCase()) != -1;
  }
  $scope.changeSelectedCategory = function(category) {
    $scope.category = category;
  }
  $scope.inRightCategory = function(categories) {
    return ($scope.category == 'All' || _.contains(categories, $scope.category));
  }


  // Block controls

  /*
    Initializes and adds a new block to the list of blocks.
  */
  $scope.addNewBlock = function(first) {
    var type = '';
    if(first) {
      type = 'Starting Items';
    }
    var value = 0;
    $scope.lists.blocks.push({
      'type':type, 
      'items':[]
    });
  }

  /*
    Removes the specified block at the given index
  */
  $scope.removeBlock = function(index) {
    $scope.refreshValues();
    $scope.lists.blocks.splice(index, 1);
  }

  /*
    Removes an item from a block at the given block and index
  */
  $scope.removeBlockItem = function(block, index) {
    block.items.splice(index,1);
    $scope.refreshValues();
  }

  /* 
    Champion search controls
    Assists with the filtering and selecting of champs in the additional options pan.
  */
  $scope.champFilter = 'All';
  $scope.champView = 'All';
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

  // Creates text file with the given and spits it out to user
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


  /*
    Handles uploading of a build onto the site.
    Can only handle files being uploaded now.
    Removed probuilds upload option to adhere to no scraping as per api challenge rules
  */
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
      $('#uploadModal').modal('hide');
    }
  }

  /*
    Creates downloadable json file of currently created build to be used in-game
  */
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
  /*
    Sends request to save current build into database attached to the current user.
  */
  $scope.save = function() {
    var data = $scope.buildObj();
    data.itemSetId = id;
    $http.post('/item-set', data)
    .then(function(data) {
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

  /*
    Initializes all objects on the page with the given data variable
     which MUST adhere to the RIOT item-set JSON format
  */
  $scope.initialize = function(data) {
    //champView
    //champFilter
    //champs
    var championData = data.champions;
    if(championData) {
      if (championData.all) {
        $scope.champFilter = 'All';
      }
      else {
        for (var i=0; i<championData.names.length; i++) {
          $scope.champs.push(championData.names[i]);
        }
      }
    }
    $scope.itemSetTitle = data.title;
    if(data.user) {
      $scope.owner = data.user;
    }
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

  /*
    Does the reverse of initialize.
    Creates a JSON formatted object that follows riots specification based on the
    build currently being created.
  */
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
// Controller for the Home Page
controller('HomeController', function($scope, $http) {
  /* Not needed currently */
}).
// Controller for Authorization related tasks
controller('AuthCtrl', function($scope, $http, $location, $rootScope, authFact) {
  // USed for login tasks
  $scope.user = {
    username: '',
    password: ''
  };

  // USed for registration tasks
  $scope.newUser = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  $scope.warning = '';

  // Empties out all fields on the login/register page
  $scope.clearLoginPage = function() {
    $scope.loginError = '';
    $scope.registerError = '';
    $scope.newUser.password = '';
    $scope.newUser.confirmPassword = '';
    $scope.newUser.username = '';
    $scope.user.username = '';
    $scope.user.password = '';
  }

  // Sends a request to login and provides errors if errors are to occur.
  $scope.login = function(){
    authFact.login($scope.user)
    //$http.post('/user/login', $scope.user)
    
    .then(function(data){
      if(data.data.info === 'success'){
        $rootScope.isAuthenticated = true;
        $rootScope.currentUser = data.data.user.username;
        $('#loginModal').modal('hide');
        $scope.clearLoginPage();
        $rootScope.setPageSuccess('You are now logged in');
      } else {
        $scope.loginError = 'Invalid Login Information';
      }
    }, function(response) {
      $scope.loginError = 'Something went wrong, refresh the page and try again';
    });
  };

  // Attempts to register a user, and catches any accounts that should not be registered
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
      authFact.register($scope.newUser)
      //$http.post('/user/register', $scope.newUser)
      .then(function(data){
        $('#loginModal').modal('hide')
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

// Controller for the Browse page
controller('SearchCtrl', function($scope, $http, $location, $timeout){
  $scope.search = '';
  $scope.sortFilter = 'Download Count';
  $scope.itemList = [];
  $scope.count = 10;

  // Retrieves item sets given all of the query options from the page's fields.
  // Only retrieves $scope.count amount of results, which is increaswed when loadmore is clicked.
  $scope.refreshItemSets = function() {
    var item = {};
    $http.post('/item-set/search', {search:$scope.search, sortFilter:$scope.sortFilter, limit: $scope.count}).then(function(response) {
      $scope.itemList = [];
      for(var i = 0; i < response.data.length; i++) {
        item = response.data[i];
        $scope.itemList.push(item);
      }
    });
  }
  // Starts a new search, and limits the amount of results to 10 by default
  $scope.searchChanged = function() {
    $scope.count = 10;
    $scope.refreshItemSets();
  }
  // Loads 10 more items than previously loaded
  $scope.loadMore = function() {
    $scope.count = $scope.count + 10;
    $scope.refreshItemSets();
  }
  $scope.refreshItemSets();
})
