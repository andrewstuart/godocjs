'use strict';

/**
 * @ngdoc overview
 * @name godocApp
 * @description
 * # godocApp
 *
 * Main module of the application.
 */
angular
  .module('godocApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        reloadOnSearch: false
      })
      .when('/:pkgPath*', {
        templateUrl: 'views/docs.html',
        controller: 'DocsCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
  });
