'use strict';

angular.module('oyeApp', [
  'ngRoute',
  'pathsList',
  'pathDetails',
  'menu',
  'about',
  'asideModule',
  'map',
  'geolocation',
  'uiGmapgoogle-maps',
  'user',
  'ngAnimate',
  'welcome',
  'pascalprecht.translate',
  'ngSanitize',
  'youtube-embed',
  'angular.filter',
  'ngPinchZoom',
  'angular-google-analytics',
  'ngFlash',
  ]).factory('$exceptionHandler', ['$log','$injector', function($log,$injector) {
    return function myExceptionHandler(exception, cause) {
      $log.error(exception,cause);
      var Analytics = $injector.get('Analytics');
      Analytics.trackEvent('error', exception, cause);
      var Flash = $injector.get('Flash');
      Flash.create('danger',"<p>Aie ! Une erreur vient de se produire :</p><p>"+exception+"</p>");
    };
  }]);;
