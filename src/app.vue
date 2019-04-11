<template>

  <div id="app" >
    <nav class="navbar navbar-dark bg-dark">
      <a class="navbar-brand" href="#/">
        ⬣ ssb guilds
      </a>
    </nav>


    <router-view></router-view>

    <top-nav />

  </div>
</template>

<script>

import topNav from './components/navigation'
import resize_handler from 'vue-resize-directive'

export default {
  name: 'app',
  components: { topNav },
  directives: { resize_handler }
}

</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
}

.navbar
{
  position: absolute;
  width: 100%;
}

.bg-dark
{
  background-color: rgba(20,20,20,0.5) !important;
  color: white !important;
}

a {
  color: black;
  text-decoration: none;
}

.hexagon path {
    transition: fill 250ms linear;
}
</style>
