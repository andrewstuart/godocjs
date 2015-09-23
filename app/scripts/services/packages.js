'use strict';

angular.module('godocApp')
  .service('packages', function ($http, $cacheFactory, $q) {
    var pkgs = this;

    function resolveWith (res, key) {
      return function(obj) {
        return res(obj[key || 'data']);
      };
    }

    /**
     * @ngdoc service
     * @name godocApp.service:packages
     * @description `packages` is a service to abstract retreival and
     * refreshing of packages.
     */

    //TODO configurable provider
    var BASE = '//godoc.astuart.co:8090/'

    var pkgCache = $cacheFactory('packages');

    /**
     * @ngdoc
     * @propertyOf godocApp.service:packages
     * @name godocApp.service:packages#all
     * @description `all` exposes all the packages known to an api server
     */

    pkgs.refreshAll = function() {
      $http.get(BASE + '-/index', {headers: {Accept: 'application/json'}})
        .then(function(res) {
          pkgs.all = res.data;
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
        }).then(resolveWith(resolve, 'data')).catch(reject);
      });
    };

    pkgs.getGraph = function(path) {
      return $q(function(resolve, reject) {
        $http.get(BASE + path, {
          params: {'import-graph': true},
          headers: {Accept: 'application/json'}
        }).then(resolveWith(resolve, 'data')).catch(reject);
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

    var canceler;

    /**
     * @ngdoc
     * @methodOf godocApp.service:packages
     * @name godocApp.service:packages#query
     * @description `query` is a method to search the api and return json
     */
    pkgs.query = function(q) {
      return $q(function(resolve, reject) {
        if(canceler) { canceler.resolve(); }
        canceler = $q.defer();

        $http({
          method: 'GET',
          url: BASE,
          params: {
            q: q
          },
          cache: pkgCache,
          timeout: canceler,
          headers: {
            Accept: 'application/json'
          }
        }).then(resolveWith(resolve, 'data')).error(reject).then(function() {
          canceler = undefined;
        });
      });
    };
  });
