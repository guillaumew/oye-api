angular.
  module('menu').
  component('menu', {
    templateUrl: 'menu/menu.template.html',
    controller: ['Apiurl', '$http', '$routeParams',
      function MenuController(Apiurl, $http, $routeParams) {
        this.menu = 'coucou';
      }
    ]
  });