<template>
  <div id="holder">
    <div class="links">
      <!-- <router-link v-if="prev" :to="prev.path" class="prev"> < prev </router-link>
      <router-link v-if="next" :to="next.path" class="next"> next > </router-link> -->
    </div>
  </div>
</template>

<script>

// import { routes } from 'router/demos';
const config = require('config.json');

// export default {
//   computed: {
//     prev: function() {
//       var index = this.findIndex();
//       if(index == -1) {
//         return undefined;
//       }
//       return index > 0 ? routes[index - 1] : undefined;
//     },
//     next: function() {
//       var index = this.findIndex();
//       if(index == -1) {
//         return undefined;
//       }
//       return index + 1 < routes.length ? routes[index + 1] : undefined;
//     },
//     sourceHref: function() {
//       var index = this.findIndex();
//       if(index == -1) {
//         return config.githubLink;
//       }
//       return routes[index].source;
//     }
//   },
//   methods: {
//     findIndex: function() {
//       var me = this.$route.name;
//       return routes.findIndex(r => r.name === me);
//     }
//   }
// }
</script>

<style scoped>
</style>
