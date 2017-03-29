angular.
  module('tutorial').
  component('tutorial', {
    templateUrl: 'tutorial/tutorial.template.html',
    controller: ['$location' , 'Analytics',
      function UserController($location, Analytics) {
        Analytics.pageView();
        // FEATURES
        var self = this;
        self.goBack = function goBack(){
          window.history.back();
        }
        self.slides=["INTRO","MAP","OBJECTS", "GOALS"];
      }
    ]
  });