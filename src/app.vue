<template>

  <div id="app" >
    <a href='#/'>
      <h1> EtherGuilds </h1>
    </a>


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
  margin-top: 30px;
}
a {
  color: black;
  text-decoration: none;
}
</style>
