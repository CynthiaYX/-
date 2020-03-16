<template>
  <div id="app">
    <Banner />
    <Map /> 
    <RightSide />
    <LeftSide />
  </div>
</template>

<script>
import Banner from './components/Banner.vue'
import LeftSide from './components/LeftSide.vue'
import RightSide from "./components/RightSide.vue";
import Map from "./components/Map.vue"; 

export default {
  name: "App",
  components: {
    Banner,
    LeftSide,
    RightSide,
    Map 
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
