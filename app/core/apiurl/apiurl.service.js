angular.
	module('core.apiurl').
	factory('Apiurl', function() {
		return {
			host: $location.protocol() + "://" + $location.host()
		}; 
	});