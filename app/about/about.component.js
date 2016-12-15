angular.
  module('about').
  component('about', {
    templateUrl: 'about/about.template.html',
    controller: ['Apiurl', '$translate',
      function AboutController(Apiurl, $translate) {
        var self = this;
      }
    ]
  });