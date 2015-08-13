angular.module('app.directive.items' [])
	.directive('lolItems', function(){
		return{
			restrict: 'E',

			scope: {
				data: '='
			},

			templateUrl: 'public/templates/items-directive.html',

			controller: function(){
				
			}
		};
	});