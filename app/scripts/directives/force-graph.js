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
        nodes: '='
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

        var width = 800, height = 800;

        var force;


        // $scope.$watch('force', function(n, old) {
        //   angular.forEach(n, function(v, k) {
        //     if ( old[k] !== v ) {
        //       force[k](v);
        //     }
        //   });
        // }, true);

        // $interval(function() {
        //   force.resume();
        // }, 10);

        var svg = d3.select(iEle[0]).append('svg')
          .attr('width', width)
          .attr('height', height)
          // .on('mousedown', mouseDown);

        svg.append('rect')
          .attr('width', width)
          .attr('height', height);

        var gnode = svg.selectAll('.gnode')
        var node = svg.selectAll('.node')
        var link = svg.selectAll('.link')

        function mouseDown () {
          d3.event.preventDefault();
          var point = d3.mouse(this);
          var node = { x: point[0], y: point[1] };
          $scope.nodes.push(node);

          // $scope.nodes.forEach(function(t) {
          //   $scope.links.push({from: node, to: t});
          // });

          render();
        }

        var path;

        function tick () {
          $scope.$parent.$digest();
          link.attr('x1', function (d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

          // path.attr("d", function(d) {
          //   var dx = d.target.x - d.source.x,
          //     dy = d.target.y - d.source.y,
          //     dr = Math.sqrt(dx * dx + dy * dy);
          //   return "M" +
          //     d.source.x + "," +
          //     d.source.y + "A" +
          //     dr + "," + dr + " 0 0,1 " +
          //     d.target.x + "," +
          //     d.target.y;
          // });

          svg.selectAll('.gnode').attr('transform', function(d) {
            return 'translate(' + d.x + ', ' + d.y + ')';
          });
        }

        function render () {
          force = d3.layout.force()
            .size([width, height])
            .nodes($scope.nodes)
            .links($scope.links)
            .linkDistance(100)
            .linkStrength(0.1)
            .charge(-1500)
            .on('tick', tick);

          link = link.data($scope.links);

          link.enter().insert('line', '.node')
            .attr('class', 'link');

            // svg.append("svg:defs").selectAll("marker")
            // .data(["end"])      // Different link/path types can be defined here
            // .enter().append("svg:marker")    // This section adds in the arrows
            // .attr("id", String)
            // .attr("viewBox", "0 -5 10 10")
            // .attr("refX", 15)
            // .attr("refY", -1.5)
            // .attr("markerWidth", 17)
            // .attr("markerHeight", 17)
            // .attr("orient", "auto")
            // .append("svg:path")
            // .attr("d", "M0,-5L10,0L0,5");

            // // add the links and the arrows
            // path = svg.append("svg:g").selectAll("path")
            // .data(force.links())
            // .enter().append("svg:path")
            // //    .attr("class", function(d) { return "link " + d.type; })
            // .attr("class", "link")
            // .style('fill', 'none')
            // .style('stroke', 'black')
            // .attr("marker-end", "url(#end)");

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
            .style('fill', 'black')
            .attr('r', 10);

          node.append('title').text(function(d) { return d.path; });

          force.start();
        }

        render();
      }
    };
  });
