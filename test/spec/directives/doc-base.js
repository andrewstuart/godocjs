'use strict';

describe('Directive: docBase', function () {

  // load the directive's module
  beforeEach(module('godocApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<doc-base></doc-base>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the docBase directive');
  }));
});
