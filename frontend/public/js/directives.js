angular.module('app.directives', []).
directive('item', function(){
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl: 'templates/item-directive.html',
		controller: function($scope) {
		}
	};
}).
directive('mybuildsmodal', function() {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'templates/my-builds-modal.html',
    controller: function($scope, $http, $location, $rootScope) {
      $rootScope.refreshMyBuilds = function() {
        console.log("Making request");
        $http.get('/item-set/user')
          .then(function(data) {
            // array of item sets -> data.data
            console.log("data", data);
            $scope.myBuilds = data.data;
          }, function(res) {
            console.log(res);
          });
      }
      $rootScope.refreshMyBuilds();
    }
  }
}).
directive('itemsetlistview', function() {
  return{
    restrict: 'E',
    scope: {
      itemset: '='
    },
    templateUrl: 'templates/item-set-list-view.html',
    controller: function($scope) {

    }
  }
});