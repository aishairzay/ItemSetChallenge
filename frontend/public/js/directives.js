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
    templateUrl: 'templates/my-builds-modal.html',
    controller: function($scope, $http, $location, $rootScope) {
      $rootScope.refreshMyBuilds = function() {
        $http.get('/item-set/user')
          .then(function(data) {
            // array of item sets -> data.data
            $scope.myBuilds = data.data;
          }, function(res) {
            console.log(res);
          });
      }
      $rootScope.refreshMyBuilds();

      $scope.deleteBuild = function(index, id) {
        console.log("IM HERE DELETING AN ITEM SET:", id);
        console.log("index", index);
        $http.delete('/item-set/' + id)
          .then(function(data) {
            if (data.data.success) {
              $scope.myBuilds.splice(index, 1);
            }
            else {
              $('#myBuildModal').modal('hide');
              $rootScope.pageError = 'Something went wrong, please refresh the page';
            }
          })
      }
    }
  }
});