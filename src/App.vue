<template>
  <div id="app">
    <Banner />
    <router-view></router-view>
  </div>
</template>

<script>
import Banner from './components/Banner.vue'
export default {
  name: "App",
  components: {
    Banner,
  }
};
</script>

<style>
html,body,#app{
 height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
