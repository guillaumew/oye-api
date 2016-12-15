angular.
  module('oyeApp').
  config([
    '$locationProvider', 
    '$routeProvider', 
    'uiGmapGoogleMapApiProvider', 
    '$translateProvider',
    'AnalyticsProvider',
    function config(
      $locationProvider, 
      $routeProvider, 
      uiGmapGoogleMapApiProvider, 
      $translateProvider,
      AnalyticsProvider) {
      
      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAk-e2vIralT717kd6wbv2_gpcSbGyByxM',
        v: '3',
        libraries: 'weather,geometry,visualization'
      });

      AnalyticsProvider
        .setAccount({
          tracker: 'UA-88901889-1',
          trackEvent: true,
          set:{
            forceSSL: true
          }
        });

      $translateProvider.useStaticFilesLoader({
        prefix: '/languages/',
        suffix: '.json'
      });
      var supported_languages = ['fr','en'];
      var lang = (navigator.language || navigator.userLanguage).substr(0,2).toLowerCase();
      if(supported_languages.indexOf(lang)>-1){
        $translateProvider.preferredLanguage(lang);
      }else{
        $translateProvider.preferredLanguage('fr');
      }
      $translateProvider.useSanitizeValueStrategy('escapeParameters');

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
        when('/about', {
          template: '<about></about>'
        }).
        otherwise('/welcome');
    }
  ]);