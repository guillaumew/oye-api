angular.
  module('pathDetails').
  component('pathDetails', {
    templateUrl: 'path-details/path-details.template.html',
    controller: ['Apiurl', '$http', '$routeParams',
      function PathDetailsController(Apiurl, $http, $routeParams) {
        var self = this;
        //self.path = {name:"Coucou"};
  	    $http({
          url: Apiurl.host + '/api/pathdetails',
          method: 'GET',
          params: {key: $routeParams.pathId}
        })
        .then(function(response) {
  	      self.response = response.data;
  	    });
      }
    ]
  });