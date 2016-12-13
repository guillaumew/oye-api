'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('pathsList').
  component('pathsList', {
    templateUrl: 'paths-list/paths-list.template.html',
    controller: ['$http', 'Apiurl', 'Analytics',
      function PathsListController($http, Apiurl, Analytics) {
        var self = this;

        Analytics.pageView();

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
