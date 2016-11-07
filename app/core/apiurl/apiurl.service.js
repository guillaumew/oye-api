angular.
	module('core.apiurl').
	factory('Apiurl', ['$location',
	function ($location) {
		return {
			host: $location.protocol() + "://" + $location.host() + ":" + $location.port()
		}; 
	}]);