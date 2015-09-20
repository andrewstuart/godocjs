'use strict';

describe('Directive: dependencyTree', function () {

  // load the directive's module
  beforeEach(module('godocApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dependency-tree></dependency-tree>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dependencyTree directive');
  }));
});
