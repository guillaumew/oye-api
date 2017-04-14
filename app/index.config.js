angular.
  module('oyeLanding').
  config([
    '$locationProvider', 
    '$routeProvider', 
    '$translateProvider',
    'AnalyticsProvider',
    function config(
      $locationProvider, 
      $routeProvider, 
      $translateProvider,
      AnalyticsProvider) {
      

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

    }
  ]);