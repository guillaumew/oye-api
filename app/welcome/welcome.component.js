angular.
  module('welcome').
  component('welcome', {
    templateUrl: 'welcome/welcome.template.html',
    controller: ['$location',
      function UserController($location) {
        var self = this;
        self.openApp = function openApp(){
          if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          }
          $location.path('/paths/');
        }
      }
    ]
  });