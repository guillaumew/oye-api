'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('pathsList').
  component('pathsList', {
    templateUrl: 'paths-list/paths-list.template.html',
    controller: ['$http', 'Apiurl', 'Analytics', '$translate',
      function PathsListController($http, Apiurl, Analytics, $translate) {
        var self = this;

        Analytics.pageView();

        var lang = $translate.proposedLanguage() || $translate.use();

        $http({
            url: Apiurl.host + '/api/pathlist?language=' + lang,
            method: 'GET'
          })
        .then(function(response) {
          self.paths = response.data;
        });
      }
    ]
  });
