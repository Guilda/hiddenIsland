const config = require('config.json');

export const routes = [
  {
    name: 'Map',
    path: '/map',
    component: require('d3-components/map')
  }
].map(r => {
  var res = r;
  res.source = config.githubLink +
               config.d3ComponentsPath +
               r.path +
               (r.folder ? '' : '.vue')
  return res;
})
