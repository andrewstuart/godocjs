'use strict';

describe('Directive: indexEntry', function () {

  // load the directive's module
  beforeEach(module('godocApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<index-entry></index-entry>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the indexEntry directive');
  }));
});
