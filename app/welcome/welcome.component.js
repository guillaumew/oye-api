angular.
  module('welcome').
  component('welcome', {
    templateUrl: 'welcome/welcome.template.html',
    controller: ['$location' , 'Analytics',
      function UserController($location, Analytics) {
        Analytics.pageView();
        // FEATURES
        var self = this;
      }
    ]
  });