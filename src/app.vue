<template>

  <div id="app">
    <router-view></router-view>
    <a href='#/'>
      <h1> EtherGuilds </h1>
    </a>

    <top-nav />

  </div>
</template>

<script>

import topNav from './components/navigation'

export default {
  name: 'app',
  components: { topNav }
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
