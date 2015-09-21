"use strict";angular.module("godocApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/search",{templateUrl:"views/search.html",controller:"SearchCtrl",reloadOnSearch:!1}).when("/:pkgPath*",{templateUrl:"views/docs.html",controller:"DocsCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]),angular.module("godocApp").controller("MainCtrl",["$scope","packages",function(a,b){a.packages=b}]).filter("dateDiff",function(){return function(a,b){return b=b||moment(),moment.duration(moment(a).diff(b))}}),angular.module("godocApp").controller("DocsCtrl",["$scope","packages","$routeParams","$timeout",function(a,b,c,d){function e(b){1===arguments.length&&(a.allExamples=[]),_.each(b,function(b,c){"Examples"===c&&b?a.allExamples=a.allExamples.concat(b):_.isObject(b)&&"parent"!==c&&e(b,!0)})}a.refresh=function(){b.refresh(c.pkgPath).then(function(b){a["package"]=b,e(b)})},b.get(c.pkgPath).then(function(b){a["package"]=b,e(b),b.docPs=b.Doc.split("\n\n")})["catch"](function(a){})["finally"](function(){return b.getGraph(c.pkgPath).then(function(b){a.pkgs=b.pkgs,_.each(a.pkgs,function(b){b.path===a["package"].ImportPath&&(a.pkgs.current=b)}),a.edges=_.map(b.edges,function(b){return{source:a.pkgs[b[0]],target:a.pkgs[b[1]]}});var c=angular.copy(b);_.each(c.edges,function(a){var b=c.pkgs[a[0]],d=c.pkgs[a[1]];b.children=b.children||[],b.children.push(angular.copy(d))}),_.each(c.pkgs,function(b){b.path===a["package"].ImportPath&&(a.tree=b)})})})}]).filter("dateDiff",function(){return function(a,b){return b=b||moment(),moment.duration(moment(a).diff(b))}}),angular.module("godocApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("godocApp").directive("docBase",["$timeout",function(a){return{templateUrl:"views/doc-base.html",restrict:"E",scope:!0,link:function(a,b,c){a.data=a.$eval(c.data)}}}]),angular.module("godocApp").service("packages",["$http","$cacheFactory","$q",function(a,b,c){var d=this,e="http://localhost:8080/",f=b("packages");d.refreshAll=function(){a.get(e+"-/index",{headers:{Accept:"application/json"}}).success(function(a){d.all=a})},d.refreshAll(),d.get=function(b){return c(function(c,d){a({method:"GET",headers:{Accept:"application/json"},url:e+b,cache:f}).success(c).error(d)})},d.getGraph=function(b){return c(function(c,d){a.get(e+b,{params:{"import-graph":!0},headers:{Accept:"application/json"}}).success(c).error(d)})},d.refresh=function(b){return f.remove(e+b),c(function(c,f){a({method:"POST",url:e+"-/refresh",headers:{Accept:"application/json"},params:{path:b}})["finally"](function(){return d.get(b).then(c,f)})})};var g;d.query=function(b){return c(function(d,h){g&&g.resolve(),g=c.defer(),a({method:"GET",url:e,params:{q:b},cache:f,timeout:g,headers:{Accept:"application/json"}}).success(d).error(h).then(function(){g=void 0})})}}]),angular.module("godocApp").directive("indexEntry",function(){return{template:'<div class="index-item" ng-repeat="item in items"><a ng-href="#/{{pkg.ImportPath}}#{{item.Name}}">{{item.Name}}</a></div>',restrict:"E",scope:{items:"=",pkg:"="},link:function(a,b,c){}}}),angular.module("godocApp").directive("forceGraph",["$timeout","$interval",function(a,b){return{template:"<div></div>",restrict:"E",scope:{links:"=",nodes:"=",root:"="},link:function(a,b,c){function d(){k.attr("d",function(a){var b=a.target.x-a.source.x,c=a.target.y-a.source.y;Math.sqrt(b*b+c*c);return"M"+a.source.x+","+a.source.y+"L"+a.target.x+","+a.target.y}),k.attr("x1",function(a){return a.source.x}).attr("y1",function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y}),h.selectAll(".gnode").attr("transform",function(a){return"translate("+a.x+", "+a.y+")"})}function e(){f=d3.layout.force().size([g,g]).nodes(a.nodes).links(a.links).linkDistance(100).linkStrength(.1).charge(-1500).on("tick",d),k=k.data(a.links),k.enter().insert("path",".node").attr("marker-end","url(#end)").attr("class","link"),i=h.selectAll(".gnode").data(a.nodes).enter().append("g").attr("class","gnode").call(f.drag),i.append("text").text(function(a){return a.path}).attr("transform","translate(20, 0)").call,j=i.append("circle").attr("class","node").style("fill",function(b){return b===a.root?"lightsteelblue":"black"}).attr("r",10),j.append("title").text(function(a){return a.path}),f.start()}a.links=a.links||[],a.nodes=a.nodes||[],a.$watchCollection("links",function(a){e()}),a.$watch("nodes",function(a){e()}),a.force={friction:.5,alpha:0,linkStrength:1,linkDistance:10};var f,g=window.innerWidth,h=d3.select(b[0]).append("svg").attr("width",g).attr("height",g);h.append("defs").selectAll("marker").data(["end"]).enter().append("marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",15).attr("markerWidth",15).attr("markerHeight",15).attr("orient","auto").append("path").attr("class","arrow").attr("d","M0,-5L10,0L0,5"),h.append("rect").attr("width",g).attr("height",g);var i=h.selectAll(".gnode"),j=h.selectAll(".node"),k=h.selectAll(".link");e()}}}]),angular.module("godocApp").directive("dependencyTree",function(){return{template:"<div></div>",restrict:"E",scope:{tree:"="},link:function(a,b,c){function d(a){var b=d3.event&&d3.event.altKey?5e3:500,c=m.nodes(f).reverse();c.forEach(function(a){a.y=180*a.depth});var g=p.selectAll("g.node").data(c,function(a){return a.id||(a.id=++j)}),h=g.enter().append("g").attr("class","node").attr("transform",function(b){return"translate("+a.y0+","+a.x0+")"}).on("click",function(a){e(a),d(a)});h.append("circle").attr("r",1e-6).style("fill",function(a){return a._children?k:l}),h.append("text").attr("x",function(a){return a.children||a._children?-10:10}).attr("dy",".35em").attr("text-anchor",function(a){return a.children||a._children?"end":"start"}).text(function(a){return a.path}).style("fill-opacity",1e-6);var i=g.transition().duration(b).attr("transform",function(a){return"translate("+a.y+","+a.x+")"});i.select("circle").attr("r",4.5).style("fill",function(a){return a._children?k:l}),i.select("text").style("fill-opacity",1);var o=g.exit().transition().duration(b).attr("transform",function(b){return"translate("+a.y+","+a.x+")"}).remove();o.select("circle").attr("r",1e-6),o.select("text").style("fill-opacity",1e-6);var q=p.selectAll("path.link").data(m.links(c),function(a){return a.target.id});q.enter().insert("path","g").attr("class","link").attr("d",function(b){var c={x:a.x0,y:a.y0};return n({source:c,target:c})}).transition().duration(b).attr("d",n),q.transition().duration(b).attr("d",n),q.exit().transition().duration(b).attr("d",function(b){var c={x:a.x,y:a.y};return n({source:c,target:c})}).remove(),c.forEach(function(a){a.x0=a.x,a.y0=a.y})}function e(a){a.children?(a._children=a.children,a.children=null):(a.children=a._children,a._children=null)}var f,g=[20,120,20,200],h=1280-g[1]-g[3],i=800-g[0]-g[2],j=0,k="lightsteelblue",l="white",m=d3.layout.tree().size([i,h]),n=d3.svg.diagonal().projection(function(a){return[a.y,a.x]}),o=d3.select(b[0]).append("svg").attr("width",h+g[1]+g[3]).attr("height",i+g[0]+g[2]),p=o.append("g").attr("transform","translate("+g[3]+","+g[0]+")");a.$watch("tree",function(a){a&&(f=a,f.x0=i/2,f.y0=0,d(f))})}}}),angular.module("godocApp").controller("SearchCtrl",["$scope","$routeParams","packages","$location",function(a,b,c,d){function e(b){c.query(b).then(function(b){a.results=b})}e(b.q),a.$on("$routeUpdate",function(){e(b.q)}),a.$watch("query",function(a){d.search("q",a)})}]),angular.module("godocApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/doc-base.html",'<div> <p> {{data.Doc}} </p> <pre>\n    <a class="code" ng-href="{{package.Files[data.Pos.File].URL}}#L{{data.Pos.Line}}" target="_blank"><span class="glyphicon glyphicon-cloud"></span></a>\n    <code class="golang"> {{data.Decl.Text}} </code>\n  </pre> <section class="examples" ng-if="data.Examples.length"> <header>{{data.Name}} Examples</header> <div ng-repeat="example in data.Examples"> <pre>{{example.Code.Text}}</pre> </div> </section> </div>'),a.put("views/docs.html",'<div class="jumbotron"> <h1>package {{package.Name}}</h1> <p>{{package.Synopsis}}</p> <p ng-show="package">Last Updated {{(package.Updated | dateDiff).humanize(true)}}</p> <a ng-show="package" class="btn btn-sm btn-default" ng-click="refresh(package.ImportPath)">Refresh</a> <a ng-show="package" target="_blank" ng-href="http://localhost:8080/{{package.ImportPath}}">Old Version</a> </div> <div ng-show="package" class="container"> <code>import {{package.ImportPath}}</code> <p ng-repeat="p in package.docPs">{{p}}</p> <section class="index"> <h2>Index</h2> <div> <div ng-if="package.Consts"><a ng-href="#/{{::package.ImportPath}}#consts">Constants</a></div> <div ng-if="package.Vars"><a ng-href="#/{{::package.ImportPath}}#pkg-vars">Variables</a></div> <div ng-repeat="func in package.Funcs track by func.Name"> <a ng-href="#/{{::package.ImportPath}}#{{func.Name}}">{{func.Decl.Text}}</a> </div> <div ng-repeat="type in package.Types track by type.Name"> <a ng-href="#/{{::package.ImportPath}}#{{type.Name}}">type {{type.Name}}</a> <ul> <li ng-repeat="func in type.Funcs track by func.Name"> <a ng-href="#/{{::package.ImportPath}}#{{type.Name}}-{{func.Name}}">{{func.Decl.Text}}</a> </li> <li ng-repeat="method in type.Methods track by method.Name"> <a ng-href="#/{{::package.ImportPath}}#{{type.Name}}-{{method.Name}}">{{method.Decl.Text}}</a> </li> </ul> </div> </div> <section class="examples" ng-if="allExamples.length"> <h4>Examples</h4> <a ng-repeat="ex in allExamples" ng-href="#/{{::package.ImportPath}}#{{ex.Name}}"> {{ex.Code.Text}} </a> </section> <section class="files"> <h4>Files</h4> <a ng-repeat="file in package.Files track by file.Name" ng-href="{{file.URL}}">{{file.Name}}</a> </section> </section> <section class="consts" ng-if="package.Consts.length"> <header id="consts"> <h2>Constants</h2> </header> <div> <div ng-repeat="const in package.Consts"> <doc-base data="const"></doc-base> </div> </div> </section> <section class="vars" ng-if="package.Vars.length"> <header id="pkg-vars"> <h2 ng-click="show = !show">Variables</h2> </header> <div ng-if="show"> <div ng-repeat="var in package.Vars"> <doc-base data="var"></doc-base> </div> </div> </section> <section class="funcs" ng-if="package.Funcs.length"> <header> <h2>Funcs</h2> </header> <div ng-repeat="func in package.Funcs track by func.Name"> <h3 id="{{func.Name}}">{{func.Name}}</h3> <doc-base data="func"></doc-base> </div> </section> <section class="types" ng-if="package.Types.length"> <header> <h2>Types</h2> </header> <div ng-repeat="type in package.Types track by type.Name"> <h3 id="{{type.Name}}">{{type.Name}}</h3> <doc-base data="type"></doc-base> <section class="funcs" ng-if="type.Funcs.length"> <h3>{{type.Name}} Functions</h3> <div ng-repeat="func in type.Funcs track by func.Name"> <h4 id="{{type.Name}}-{{func.Name}}">{{func.Name}} <a ng-href="#/{{package.ImportPath}}#{{type.Name}}-{{func.Name}}"><span class="glyphicon glyphicon-link"></span></a></h4> <doc-base data="func"></doc-base> </div> </section> <section class="methods" ng-if="type.Methods.length"> <h3>{{type.Name}} Methods</h3> <div ng-repeat="meth in type.Methods track by meth.Name"> <h4 id="{{type.Name}}-{{meth.Name}}">func ({{meth.Recv}}) {{meth.Name}}</h4> <doc-base data="meth"></doc-base> </div> </section> </div> </section> <section class="imports col-md-6" ng-if="package.Imports.length"> <h2>Imports</h2> <div ng-repeat="imp in package.Imports track by imp"> <a ng-href="#/{{imp}}">{{imp}}</a> </div> </section> </div> <force-graph root="pkgs.current" nodes="pkgs" links="edges"></force-graph>'),a.put("views/main.html",'<div class="container"> <div class="input-group"> <span class="input-group-addon"> <span class="glyphicon glyphicon-search"></span> </span> <input type="text" ng-model="search" class="form-control" aria-label="Search packages"> </div> <h1>Packages</h1> <div ng-repeat="package in packages.all | filter:search"> <a ng-href="#{{package.path}}">{{package.path}}</a> {{package.synopsis}} </div> </div>'),a.put("views/search.html",'<div class="container"> <div class="input-group"> <span class="input-group-addon"> <span class="glyphicon glyphicon-search"></span> </span> <input type="text" ng-model="query" class="form-control" aria-label="Documentation Search"> </div> <p ng-repeat="res in results track by $id(res)"> <a ng-href="#/{{res.path}}">{{res.path}}</a> <span>{{res.synopsis}}</span> </p> </div>')}]);