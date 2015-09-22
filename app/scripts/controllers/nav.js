'use strict';

/**
 * @ngdoc function
 * @name godocApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the godocApp
 */
angular.module('godocApp')
  .controller('NavCtrl', function ($scope, $location) {
    $scope.routes = [{
      title: 'Index',
      path: '/',
    },{
      title: 'Search',
      path: '/search'
    }];

    $scope.location = $location;
  });
