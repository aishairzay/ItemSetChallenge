

angular.module('app.directive.items', []).
directive('lolItems', function(){
	return{
		restrict: 'E',

		scope: {
			data: '='
		},

		templateUrl: 'templates/items.directive.html',

		controller: function(){
		}
	};
});