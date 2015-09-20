'use strict';

/**
 * @ngdoc function
 * @name godocApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the godocApp
 */
angular.module('godocApp')
  .controller('DocsCtrl', function ($scope, packages, $routeParams, $timeout) {

    $scope.refresh = function() {
      packages.refresh($routeParams.pkgPath)
        .then(function(pkg) {
          $scope.package = pkg;
        });
    };

    packages.get($routeParams.pkgPath)
      .then(function(pkg) {
        $scope.package = pkg;
      })
      .catch(function(err) {
        if ( err === null ) {
          //TODO Show message somehow
        }
      });

  }).filter('dateDiff', function() {
    return function(input, compareTo) {
      compareTo = compareTo || moment();
      return moment.duration(moment(input).diff(compareTo));
    }
  });
