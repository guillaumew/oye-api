angular.
  module('oyeApp').
  config(['$locationProvider', '$routeProvider', 'uiGmapGoogleMapApiProvider',
    function config($locationProvider, $routeProvider, uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAk-e2vIralT717kd6wbv2_gpcSbGyByxM',
            v: '3.20',
            libraries: 'weather,geometry,visualization'
        });

      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/paths', {
          template: '<paths-list></paths-list>'
        }).
        when('/path/:pathId', {
          template: '<path-details></path-details>'
        }).
        when('/welcome', {
          template: '<welcome></welcome>'
        }).
        otherwise('/welcome');
    }
  ]);