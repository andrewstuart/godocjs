'use strict';

/**
 * @ngdoc directive
 * @name godocApp.directive:indexEntry
 * @description
 * # indexEntry
 */
angular.module('godocApp')
  .directive('indexEntry', function () {
    return {
      template: '<div class="index-item" ng-repeat="item in items"><a ng-href="#/{{pkg.ImportPath}}#{{item.Name}}">{{item.Name}}</a></div>',
      restrict: 'E',
      scope: {
        items: '=',
        pkg: '='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
