angular.module('LogDimensionModule', ["ZomeDefinitionModule"])

  .controller('LogDimensionController', ["zomeDefinitionService", function(zomeDef) {
    this.logDimension = zomeDef().logDimension;


    var axeFunction = d3.svg.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .interpolate("linear");

    var svg = d3.select("#logDimensionGraph").append("svg").attr("width", 600)
                              .attr("height", 600);

    var svgContainer = svg.append("g").attr("transform", "translate(10, 10)");


    var logFace = svgContainer.append("rect")
                                .attr("class", "logFace")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("stroke", "blue")
                                .attr("stroke-width", 2)
                                .attr("width", this.logDimension.width)
                                .attr("height", this.logDimension.height)
                                .attr("fill", "transparent");

    var logBottomPoints = [{x : 500 - this.logDimension.width, y : 500}, {x : 500, y : 500}, {x : 500, y : 500 - this.logDimension.height}]
    var logBottom = svgContainer.append("path")
                              .attr("class", "logBottom")
                              .attr("d", axeFunction(logBottomPoints))
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("fill", function(d) { return "transparent"});
    var logEdge1 = svgContainer.append("line")
                              .attr("class", "logEdge1")
                              .attr("x1", 0)
                              .attr("y1", this.logDimension.height)
                              .attr("x2", 500 - this.logDimension.width)
                              .attr("y2", 500)
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("fill", function(d) { return "transparent"});
    var logEdge2 = svgContainer.append("line")
                              .attr("class", "logEdge2")
                              .attr("x1", this.logDimension.width)
                              .attr("y1", this.logDimension.height)
                              .attr("x2", 500)
                              .attr("y2", 500)
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("fill", function(d) { return "transparent"});
    var logEdge3 = svgContainer.append("line")
                              .attr("class", "logEdge3")
                              .attr("x1", this.logDimension.width)
                              .attr("y1", 0)
                              .attr("x2", 500)
                              .attr("y2", 500 - this.logDimension.height)
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("fill", function(d) { return "transparent"});


    this.render = function() {
      var transition = d3.select("#logDimensionGraph").transition();
      transition.selectAll(".logFace")
                .duration(750)
                .attr("width", this.logDimension.width)
                .attr("height", this.logDimension.height);
      logBottomPoints = [{x : 500 - this.logDimension.width, y : 500}, {x : 500, y : 500}, {x : 500, y : 500 - this.logDimension.height}]
      transition.selectAll(".logBottom")
                .duration(750)
                .attr("d", axeFunction(logBottomPoints));
      transition.selectAll(".logEdge1")
                .duration(750)
                .attr("y1", this.logDimension.height)
                .attr("x2", 500 - this.logDimension.width);
      transition.selectAll(".logEdge2")
                .duration(750)
                .attr("x1", this.logDimension.width)
                .attr("y1", this.logDimension.height);
      transition.selectAll(".logEdge3")
                .duration(750)
                .attr("x1", this.logDimension.width)
                .attr("y2", 500 - this.logDimension.height);
    }

}]);
