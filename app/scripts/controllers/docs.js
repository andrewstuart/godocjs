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
          getExamples(pkg);
        });
    };

    $scope.path = $routeParams.pkgPath;

    //TODO move this to packages service
    //Traverse object graph and find all Examples children
    function getExamples (o) {
      if ( arguments.length === 1 ) { $scope.allExamples = []; }

      _.each(o, function(child, k) {
        if ( k === 'Examples' && child ) {
          $scope.allExamples = $scope.allExamples.concat(child);
        } else if ( _.isObject(child) && k !== 'parent' ) {
          getExamples(child, true)
        }
      });
    }

    var pathSplit = $routeParams.pkgPath.split('/');
    $scope.tmpPkgName = pathSplit[pathSplit.length-1] || undefined;

    packages.get($routeParams.pkgPath)
      .then(function(pkg) {
        $scope.package = pkg;
        getExamples(pkg);

        pkg.docPs = pkg.Doc.split('\n\n');
      })
      .catch(function(err) {
        $scope.error = err;
        if ( err === null ) {
          $scope.error = "Package was not found.";
        }
      }).finally(function() {
        return packages.getGraph($routeParams.pkgPath)
        .then(function(graph) {
          $scope.pkgs = graph.pkgs;

          _.each($scope.pkgs, function(pkg) {
            if ( pkg.path === $scope.package.ImportPath ) {
              $scope.pkgs.current = pkg;
            }
          });

          $scope.edges = _.map(graph.edges, function(e) {
            return {
              source: $scope.pkgs[e[0]],
              target: $scope.pkgs[e[1]]
            };
          });

          var g = angular.copy(graph);

          _.each(g.edges, function(e) {
            var parent = g.pkgs[e[0]];
            var child = g.pkgs[e[1]];

            parent.children = parent.children || []
            parent.children.push(angular.copy(child));
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
