'use strict';

angular.module('oyeLanding', [
  'ngRoute',
  'ngAnimate',
  'welcome',
  'pascalprecht.translate',
  'ngSanitize',
  'angular.filter',
  'angular-google-analytics'
  ]).factory('$exceptionHandler', ['$log','$injector', function($log,$injector) {
    return function myExceptionHandler(exception, cause) {
      $log.error(exception,cause);
      var Analytics = $injector.get('Analytics');
      var exception_msg;
      var cause_msg;
      if(exception){
        exception_msg=exception.toString();
      }
      if(cause){
        cause_msg=cause.toString();
      }
      Analytics.trackEvent('error', exception_msg, cause_msg);
      var Flash = $injector.get('Flash');
      var $translate = $injector.get('$translate');
      // $translate('GLOBAL.ERROR').then(function (message) {
      //   Flash.create('danger',"<p>"+message+"</p><p>"+exception+"</p>");
      // });
    };
  }]);;
