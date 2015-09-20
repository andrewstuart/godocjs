'use strict';

/**
 * @ngdoc directive
 * @name godocApp.directive:docBase
 * @description
 * # docBase
 */
angular.module('godocApp')
  .directive('docBase', function () {
    return {
      templateUrl: 'views/doc-base.html',
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function postLink($scope, iEle, iAttrs) {
      }
    };
  });
