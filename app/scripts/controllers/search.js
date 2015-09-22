'use strict';

/**
 * @ngdoc function
 * @name godocApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the godocApp
 */
angular.module('godocApp')
  .controller('SearchCtrl', function ($scope, $routeParams, packages, $location) {
    function query (q) {
      if ( !q ) return;

      packages.query(q).then(function(res) {
        $scope.results = res;
      });
    }

    query($routeParams.q);

    $scope.$on('$routeUpdate', function() {
      query($routeParams.q);
    });

    $scope.$watch('query', function(q) {
      $location.search('q', q);
    });
  });
