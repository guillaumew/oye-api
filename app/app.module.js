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
      var $translate = $injector.get('$translate');
      $translate('GLOBAL.ERROR').then(function (message) {
        Flash.create('danger',"<p>"+message+"</p><p>"+exception+"</p>");
      });
    };
  }]);;
