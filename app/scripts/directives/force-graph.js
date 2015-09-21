'use strict';

/**
 * @ngdoc directive
 * @name d3TestsApp.directive:forceGraph
 * @description
 * # forceGraph
 */
angular.module('godocApp')
  .directive('forceGraph', function ($timeout, $interval) {
    return {
      template: '<div>' +
        '</div>',
      restrict: 'E',
      scope: {
        links: '=',
        nodes: '=',
        root: '='
      },
      link: function postLink($scope, iEle, iAttrs) {

        $scope.links = $scope.links || [];
        $scope.nodes = $scope.nodes || [];

        $scope.$watchCollection('links', function(l) {
          render();
        });

        $scope.$watch('nodes', function(n) {
          render();
        });


        $scope.force = {
          friction: 0.5,
          alpha: 0,
          linkStrength: 1,
          linkDistance: 10
        };

        var size = window.innerWidth;
        var force;

        var svg = d3.select(iEle[0]).append('svg')
          .attr('width', size)
          .attr('height', size)
          // .on('mousedown', mouseDown);

        // build the arrow.
        svg.append("defs").selectAll("marker")
          .data(["end"])      // Different link/path types can be defined here
        .enter().append("marker")    // This section adds in the arrows
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("markerWidth", 15)
          .attr("markerHeight", 15)
          .attr("orient", "auto")
        .append("path")
          .attr('class', 'arrow')
          .attr("d", "M0,-5L10,0L0,5");

        svg.append('rect')
          .attr('width', size)
          .attr('height', size);

        var gnode = svg.selectAll('.gnode')
        var node = svg.selectAll('.node')
        var link = svg.selectAll('.link')

        function mouseDown () {
          d3.event.preventDefault();
          var point = d3.mouse(this);
          var node = { x: point[0], y: point[1] };
          $scope.nodes.push(node);

          render();
        }

        var path;

        // var ticks = 0;

        function tick () {
          // if ( ++ ticks % 10 === 0 ) { $scope.$parent.$digest(); }

          link.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);

            return "M" +
              d.source.x + "," +
              d.source.y + "L" +
              d.target.x + "," +
              d.target.y;
          });

          link.attr('x1', function (d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

          svg.selectAll('.gnode').attr('transform', function(d) {
            return 'translate(' + d.x + ', ' + d.y + ')';
          });
        }

        function render () {
          force = d3.layout.force()
            .size([size, size])
            .nodes($scope.nodes)
            .links($scope.links)
            .linkDistance(100)
            .linkStrength(0.1)
            .charge(-1500)
            .on('tick', tick);

          link = link.data($scope.links);

          link.enter().insert('path', '.node')
            .attr('marker-end', 'url(#end)')
            .attr('class', 'link');

          gnode = svg.selectAll('.gnode')
            .data($scope.nodes)
            .enter()
            .append('g')
            .attr('class', 'gnode')
            .call(force.drag);

          gnode
            .append('text')
            .text(function(d) { return d.path; })
            .attr('transform', 'translate(20, 0)')
            .call

          node = gnode.append('circle')
            .attr('class', 'node')
            .style('fill', function(d) { return d === $scope.root ? 'lightsteelblue' : 'black';})
            .attr('r', 10);

          node.append('title').text(function(d) { return d.path; });

          force.start();
        }

        render();
      }
    };
  });
