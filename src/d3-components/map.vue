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
      <MapSVG id="map_svg" :key="map_key"></MapSVG>
    </div>

    <div id="thread_container" class="card" style="width: 18rem;">
      <ul id="status" class="card-body list-unstyled">
      <li class="media">
        <div class="media-body">
          {{ $route.params.x }} / {{ $route.params.y }}

          No Nearby Messages
        </div>
      </li>
    </ul>  
    </div>

    
  </div>
</template>


<script>
var d3 = require("d3");

import MapSVG from './map.svg';

import * as topojson from "topojson-client";
import layout from './circle-layout'
import resize from 'vue-resize-directive'

window.uber_hack_context = ""


const directives = {
  resize
}

export default {

  directives,

  components: {
    MapSVG
  },

  data () {
    return { 
      map_key: 1
    }
  },

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
      console.log("resize?")
      const size = this.getSize()
      const {g, svg, tree} = this.internaldata
      
      this.transformSvg(g, size)
      layout.optimizeSize(tree, size, this.margin, this.textContraint)
      this.redraw()
    },
    inital_draw: function() {
      console.log("inital_draw")

      uber_hack_context = this;

      var margin = {top: 5, right: 5, bottom: 5, left: 5},
      width = 2000,
      height = 2000
      
      const size = this.getSize()
      const svg = d3.select("#map_svg")
      
      var radius = 20;

      var topology = hexTopology(radius, size.width, size.height);
      var projection = hexProjection(radius);
      var path = d3.geoPath(projection);


      var container_container = svg.insert("g", "#map_svg")
      var container = container_container.append("g")

      container.attr("class", "hexagon")
        .selectAll("path")
          .data(topology.objects.hexagons.geometries)
        .enter().append("path")
          .attr("d", function(d) { return path(topojson.feature(topology, d)); })
          .attr("class", function(d) { return d.fill ? "fill" : null; })
          .on("mousedown", mousedown)

      container_container.append("g").append("path")
          .datum(topojson.mesh(topology, topology.objects.hexagons))
          .attr("class", "mesh")
          .attr("d", path);

      var border = container_container.append("g").append("path")
          .attr("class", "border")
          .call(draw_border);

      var mousing = 0;

      function mousedown(d) {
        uber_hack_context.$router.push({ path: `/${d.i}/${d.j}`})

        uber_hack_context.$data.map_key += 1 
      }

      function draw_border(border) {
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
              j: j,
              i: i
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
    },
    redraw: function() {
      console.log("redraw")
      
    },
    location_redraw: function() {
      console.log("location redraw")
      
    }
  },

  mounted: function() {
    this.inital_draw()
    this.redraw()
  },
  updated: function() {

    this.inital_draw()
    this.redraw()
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


#thread_container
{
  position: absolute;
  margin-left: 60%;
  top: 300px;
}

svg {
    position:fixed; top:0; left:0; height:100%; width:100%;
    background-color: transparent;
    cursor: default;
}

#map
{
  width: 1280px;
  height: 960px;
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

.hexagon {
  fill: transparent;
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
