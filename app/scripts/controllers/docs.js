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
      }).finally(function() {
        return packages.getGraph($routeParams.pkgPath)
        .then(function(graph) {
          $scope.pkgs = graph.pkgs;

          $scope.edges = _.map(graph.edges, function(e) {
            return {
              source: $scope.pkgs[e[0]],
              target: $scope.pkgs[e[1]]
            };
          });

          var g = angular.copy(graph);

          _.each(g.edges, function(e) {
            g.pkgs[e[0]].children = g.pkgs[e[0]].children || []
            g.pkgs[e[0]].children.push(g.pkgs[e[1]])
          });

          _.each(g.pkgs, function(p) {
            if ( p.path === $scope.package.ImportPath ) {
              $scope.tree = p;
            }
          });
        });
      });

  }).filter('dateDiff', function() {
    return function(input, compareTo) {
      compareTo = compareTo || moment();
      return moment.duration(moment(input).diff(compareTo));
    }
  });
