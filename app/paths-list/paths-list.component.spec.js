'use strict';

describe('pathsList', function() {

  // Load the module that contains the `pathsList` component before each test
  beforeEach(module('pathsList'));

  // Test the controller
  describe('PathsListController', function() {

    it('should create a `paths` model with 3 paths', inject(function($componentController) {
      var ctrl = $componentController('pathsList');

      expect(ctrl.paths.length).toBe(2);
    }));

  });

});
