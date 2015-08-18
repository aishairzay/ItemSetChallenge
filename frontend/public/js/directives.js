angular.module('app.directives', []).
directive('item', function(){
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl: 'templates/item-directive.html',
		controller: function($scope) {
      $scope.imageUrl = 'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/' + $scope.data.id + '.png';
		}
	};
}).
directive('block', function() {
	return {
		restrict: 'E',
		scope: {
			items: '=',
			type: '='
		},
		templateUrl: 'templates/item-set-block.html',
		controller: function($scope) {
			$scope.isBlock = true;
			$scope.unactivated = true;
			$scope.makeNewBlock = function() {
				$scope.unactivated = false;
				$scope.$parent.addNewBlock();
			}
		}
	}
});
