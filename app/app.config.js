angular.
  module('oyeApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/paths', {
          template: '<paths-list></paths-list>'
        }).
        when('/path/:pathId', {
          template: '<path-details></path-details>'
        }).
        otherwise('/paths');
    }
  ]);