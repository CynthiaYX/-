<template>
  <div class="Home">
    <Map />     
    <RightSide />
    <LeftSide />
  </div>
</template>

<script>
import LeftSide from './LeftSide.vue'
import RightSide from "./RightSide.vue";
import Map from "./Map.vue"; 


export default {
  components: {
    LeftSide,
    RightSide,
    Map,
  }
};
</script>
<style scoped>
.Home{
 height: 100%;
}
</style>