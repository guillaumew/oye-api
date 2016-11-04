'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('pathsList').
  component('pathsList', {
    templateUrl: 'paths-list/paths-list.template.html',
    controller: ['$http', 'Apiurl',
      function PathsListController($http, Apiurl) {
        var self = this;
        $http({
            url: Apiurl.host + '/api/pathlist',
            method: 'GET'
          })
        .then(function(response) {
          self.paths = response.data;
        });
      }
    ]
  });
