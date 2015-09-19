'use strict';

/**
 * @ngdoc function
 * @name godocApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the godocApp
 */
angular.module('godocApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('http://localhost:8080/github.com/andrewstuart/go-hnfire', {
      headers: {
        Accept: 'application/json'
      }
    }).success(function(pkg) {
      $scope.package = pkg;
    });
  }).filter('dateDiff', function() {
    return function(input, compareTo) {
      compareTo = compareTo || moment();
      return moment.duration(moment(input).diff(compareTo));
    }
  });
