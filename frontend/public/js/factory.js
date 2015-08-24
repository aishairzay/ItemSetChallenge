angular.module('app.factory', [])
.factory('authFact', function($http) {
	var authFact = {};

	authFact.status = null;

	authFact.checkAuth = function() {
		return $http.get('/user/is-logged-in');
	}

	authFact.login = function(cred) {
		$http.post('/user/login', cred);
	}

	authFact.register = function(newCred) {
		return $http.post('/user/register', newCred);
	}

	authFact.logout = function() {
		return $http.get('/user/logout');
	}

	return authFact;
});