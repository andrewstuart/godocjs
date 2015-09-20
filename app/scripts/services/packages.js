'use strict';

angular.module('godocApp')
  .service('packages', function ($http, $cacheFactory, $q) {
    var pkgs = this;

    /**
     * @ngdoc service
     * @name godocApp.service:packages
     * @description `packages` is a service to abstract retreival and
     * refreshing of packages.
     */

    //TODO configurable provider
    var BASE = 'http://localhost:8080/'
    var API = 'http://api.localhost:8080/'

    var pkgCache = $cacheFactory('packages');

    /**
     * @ngdoc
     * @propertyOf godocApp.service:packages
     * @name godocApp.service:packages#all
     * @description `all` exposes all the packages known to an api server
     */

    pkgs.refreshAll = function() {
      $http.get(API + 'packages').success(function(res) {
        pkgs.all = res.results;
      });
    };

    pkgs.refreshAll();

    /**
     * @ngdoc
     * @methodOf godocApp.service:packages
     * @name godocApp.service:packages#get
     * @param {String} path The package import path
     * @description `get` is a method to get package information from the
     * remote server or local cache.
     */
    pkgs.get = function(path) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          url: BASE + path,
          cache: pkgCache
        }).success(resolve).error(reject);
      });
    };

    /**
     * @ngdoc
     * @methodOf godocApp.service:packages
     * @name godocApp.service:packages#refresh
     * @param {String} path The package import path
     * @description `refresh` is a method to clear the local cache, request a
     * server-side refresh, and retrieve the new information.
     */

    pkgs.refresh = function(path) {
      pkgCache.remove(BASE + path);

      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: BASE + '-/refresh',
          headers: {
            Accept: 'application/json'
          },
          params: {
            path: path
          }
        }).finally(function() {
          return pkgs.get(path).then(resolve, reject);
        });
      });
    };
  });
