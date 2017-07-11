<!--
Links:
  Components: https://vuejs.org/v2/guide/components.html
  .vue files: https://vuejs.org/v2/guide/single-file-components.html

Advanced:
  Component Lifecyrcle: https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
  Virtual DOM: https://medium.com/js-dojo/whats-new-in-vue-js-2-0-virtual-dom-dc4b5b827f40#.hexwxh9m3
-->

<template>
  <div>
    <div id="map">
    </div>
    <div>
      {{ position.x }} / {{ position.y }}
    </div>
  </div>
</template>


<script>
var d3 = require("d3");
import * as topojson from "topojson-client";

window.uber_hack_context = ""

export default {


  data: function(){
    return {
      position: { x: 0, y: 0 }
    }
  },

  methods: {
    resize: function() {
      const size = this.getSize()
      const {g, svg, tree} = this.internaldata
      svg.attr('width', size.width)
       .attr('height', size.height)
      this.transformSvg(g, size)
      layout.optimizeSize(tree, size, this.margin, this.textContraint)
      this.redraw()
    }
  },

  mounted: function() {

    uber_hack_context = this;

    var width = 960,
        height = 500,
        radius = 20;

    var topology = hexTopology(radius, width, height);

    var projection = hexProjection(radius);

    var path = d3.geoPath(projection);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "hexagon")
      .selectAll("path")
        .data(topology.objects.hexagons.geometries)
      .enter().append("path")
        .attr("d", function(d) { return path(topojson.feature(topology, d)); })
        .attr("class", function(d) { return d.fill ? "fill" : null; })
        .on("mousedown", mousedown)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    svg.append("path")
        .datum(topojson.mesh(topology, topology.objects.hexagons))
        .attr("class", "mesh")
        .attr("d", path);

    var border = svg.append("path")
        .attr("class", "border")
        .call(redraw);

    var mousing = 0;

    function mousedown(d) {
      console.log(this.hack_context)
      debugger
      mousing = d.fill ? -1 : +1;
      mousemove.apply(this, arguments);

      this.position.x = 900;
    }

    function mousemove(d) {
      if (mousing) {
        d3.select(this).classed("fill", d.fill = mousing > 0);
        border.call(redraw);
      }
    }

    function mouseup() {
      mousemove.apply(this, arguments);
      mousing = 0;
    }

    function redraw(border) {
      border.attr("d", path(topojson.mesh(topology, topology.objects.hexagons, function(a, b) { return a.fill ^ b.fill; })));
    }

    function hexTopology(radius, width, height) {
      var dx = radius * 2 * Math.sin(Math.PI / 3),
          dy = radius * 1.5,
          m = Math.ceil((height + radius) / dy) + 1,
          n = Math.ceil(width / dx) + 1,
          geometries = [],
          arcs = [];

      for (var j = -1; j <= m; ++j) {
        for (var i = -1; i <= n; ++i) {
          var y = j * 2, x = (i + (j & 1) / 2) * 2;
          arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
        }
      }

      for (var j = 0, q = 3; j < m; ++j, q += 6) {
        for (var i = 0; i < n; ++i, q += 3) {
          geometries.push({
            type: "Polygon",
            arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
            fill: Math.random() > i / n * 3
          });
        }
      }

      return {
        transform: {translate: [0, 0], scale: [1, 1]},
        objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
        arcs: arcs
      };
    }

    function hexProjection(radius) {
      var dx = radius * 2 * Math.sin(Math.PI / 3),
          dy = radius * 1.5;
      return {
        stream: function(stream) {
          return {
            point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
            lineStart: function() { stream.lineStart(); },
            lineEnd: function() { stream.lineEnd(); },
            polygonStart: function() { stream.polygonStart(); },
            polygonEnd: function() { stream.polygonEnd(); }
          };
        }
      };
    }
  }
}
</script>

<style>

.hexagon {
  fill: white;
  pointer-events: all;
}

.hexagon path {
  -webkit-transition: fill 250ms linear;
  transition: fill 250ms linear;
}

.hexagon :hover {
  fill: pink;
}

.hexagon .fill {
  fill: pink;
}

.mesh {
  fill: none;
  stroke: #000;
  stroke-opacity: .2;
  pointer-events: none;
}

.border {
  fill: none;
  stroke: #555;
  stroke-width: 3px;
  pointer-events: none;
}
</style>
