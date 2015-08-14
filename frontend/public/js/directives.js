angular.module('app.directives', []).
directive('item', function(){
	return{
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl: 'templates/item-directive.html',
		controller: function($scope){
      $scope.imageUrl = 'http://ddragon.leagueoflegends.com/cdn/5.15.1/img/item/' + $scope.data.id + '.png';
		}
	};
});