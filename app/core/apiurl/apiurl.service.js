angular.
	module('core.apiurl').
	factory('Apiurl', ['$location',
	function ($location) {
		var host = $location.protocol() + "://" + $location.host() + ":" + $location.port();
		
		if ($location.host().indexOf("localhost")>-1){
			host="https://oye-app.herokuapp.com";
		}

		return {
			host: host
		}; 
	}]);