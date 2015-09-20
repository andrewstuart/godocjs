'use strict';

/**
 * @ngdoc directive
 * @name godocApp.directive:docBase
 * @description
 * # docBase
 */
angular.module('godocApp')
  .directive('docBase', function ($timeout) {
    return {
      templateUrl: 'views/doc-base.html',
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function postLink($scope, iEle, iAttrs) {
        // setTimeout(function() {
        //   Array.prototype.slice.call(iEle[0].querySelectorAll('pre code')).forEach(function(ele) {
        //     hljs.highlightBlock(ele);
        //   });
        // }, 0);
      }
    };
  });
