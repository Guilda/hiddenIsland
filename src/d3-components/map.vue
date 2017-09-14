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
      <svg id="map_svg">
      </svg>

      <!-- <object data="static/island.svg" type="image/svg+xml"> -->
      <!-- </object> -->
    </div>
    <div>
      {{ $route.params.x }} / {{ $route.params.y }}
    </div>
  </div>
</template>


<script>
var d3 = require("d3");
import * as topojson from "topojson-client";
import layout from './circle-layout'
import resize from 'vue-resize-directive'
import _ from 'underscore'

window.uber_hack_context = ""

const directives = {
  resize
}

export default {

  // data: function(){
  //
  // },

  directives,

  methods: {
    getSize () {

      var width = this.$el.clientWidth
      var height = this.$el.clientHeight
      return { width, height }
    },
    transformSvg (g, size) {
      size = size || this.getSize()
      return layout.transformSvg(g, this.margin, size)
    },
    updateTransform (g, size) {
      size = size || this.getSize()
      return layout.updateTransform(g, this.margin, size)
    },
    resize: function() {
      const size = this.getSize()
      const {g, svg, tree} = this.internaldata
      // svg.attr('width', size.width)
      //  .attr('height', size.height)
      this.transformSvg(g, size)
      layout.optimizeSize(tree, size, this.margin, this.textContraint)
      this.redraw()
    }
  },

  mounted: function() {

    uber_hack_context = this;

    var margin = {top: -5, right: -5, bottom: -5, left: -5},
    width = 2000,
    height = 2000
    var zoom = d3.zoom()
    .scaleExtent([1, 100])
    .on("zoom", zoomed);

    const size = this.getSize()
    const svg = d3.select("#map_svg")
          // .attr('width', size.width)
          // .attr('height', size.height)
    // const g = this.transformSvg(svg.append('g').call(zoom), size)
    // const g = svg.append('g').call(zoom)


    var radius = 20;

    // console.log(size)

    var topology = hexTopology(radius, size.width, size.height);

    var projection = hexProjection(radius);

    var path = d3.geoPath(projection);

    // var drag = d3.drag()
    //     .origin(function(d) { return d; })
    //     .on("dragstart", dragstarted)
    //     .on("drag", dragged)
    //     .on("dragend", dragended);

    function zoomed() {
      container_container.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')')
    }


    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }


    var container_container = svg.append("g")
    var container = container_container.append("g")

    svg.call(zoom)


    container.attr("class", "hexagon")
      .selectAll("path")
        .data(topology.objects.hexagons.geometries)
      .enter().append("path")
        .attr("d", function(d) { return path(topojson.feature(topology, d)); })
        .attr("class", function(d) { return d.fill ? "fill" : null; })
        .on("mousedown", mousedown)
        // .on("mousemove", mousemove)
        // .on("mouseup", mouseup)

    container_container.append("g").append("path")
        .datum(topojson.mesh(topology, topology.objects.hexagons))
        .attr("class", "mesh")
        .attr("d", path);

    var border = container_container.append("g").append("path")
        .attr("class", "border")
        .call(redraw);

    var mousing = 0;

    function mousedown(d) {
      // mousing = d.fill ? -1 : +1;
      // mousemove.apply(this, arguments);
      //
      uber_hack_context.$router.push({ path: `/${d.x}/${d.y}`})
      // border.call(redraw)
    }
    //
    // function mousemove(d) {
    //   if (mousing) {
    //
    //     d3.select(this).classed("fill", d.fill = mousing > 0);
    //     border.call(redraw);
    //   }
    // }
    //
    // function mouseup() {
    //   mousemove.apply(this, arguments);
    //   mousing = 0;
    // }

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
            fill: uber_hack_context.$route.params.x == i && uber_hack_context.$route.params.y == j,
            x: i,
            y: j
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

@import url('https://fonts.googleapis.com/css?family=Bitter:400,400i&subset=latin-ext');
html, body {
  margin:0;
  padding:0;
  overflow:hidden;
}

svg {
    position:fixed; top:0; left:0; height:100%; width:100%;
    background-color: #5E4FA2;
    cursor: default;
}

#map
{
  width: 1280px;
  height: 960px;
}

.terrs {
    stroke-width: 0.67px;
    stroke-linejoin: round;
    stroke-linecap: round;
    -webkit-filter: saturate(0.8) contrast(1.1);
    filter: saturate(0.8) contrast(1.1);
}

.areas {
    stroke-width: 0.67px;
    stroke-linejoin: round;
    stroke-linecap: round;
    opacity: 0.8;
}

.rivers {
    fill: none;
    stroke: #4D83AE;
    stroke-width: 0.4px;
    stroke-linecap: round;
}

.coastline {
    stroke-width: 0.74px;
    stroke: rgb(86, 86, 109);
    stroke-linecap: round;
}

.burgs {
    stroke-width: 0.2px;
    opacity: 0.8;
    font-family: verdana;
    font-size: 2px;
    text-anchor: middle;
    cursor: pointer;
}

.capital {
    fill: white;
    stroke: black;
    opacity: 0.8;
}

.manor {
    stroke: none;
    fill: black;
    opacity: 0.8;
}

.capital:hover,
.manor:hover {
    stroke: blue;
    cursor: pointer;
}

.names {
    font-family: 'Bitter', verdana;
    text-anchor: middle;
    fill: #3e3e4b;
    text-shadow: 0 0 6px white;
}

.active {
    text-shadow: 0 0 6px red;
    cursor: grabbing;
    cursor: -webkit-grabbing;
}

.borders {
    stroke-width: 0.72px;
    stroke: rgb(86, 86, 109);
    stroke-dasharray: 0.5, 0.5;
    stroke-linecap: butt;
}

.hills {
    stroke-width: 0.1px;
    fill: #999999;
}

.mounts {
    stroke-width: 0.1px;
    fill: white;
}

.strokes {
    stroke-width: 0.08px;
    width: 2px;
    stroke: #5c5c70;
    stroke-dasharray: 0.5, 0.7;
    stroke-linecap: round;
}

.swamps {
    stroke-width: 0.05px;
    fill: none;
    stroke: #5c5c70;
}

.forests {
    stroke-width: 0.1px;
    stroke: #5c5c70;
}

#options {
    position: absolute;
    background-color: white;
    border: solid 1px #5e4fa2;
    border-radius: 0 0 20px 0;
    padding: 0 0 5px 5px;
}

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
