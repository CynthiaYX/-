<template>
  <div class="Map"></div>
</template>
<script>
import { loadModules } from "esri-loader";
export default {
  mounted() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(["esri/Map", "esri/views/MapView"], { css: true }).then(
      ([ArcGISMap, MapView]) => {
        const map = new ArcGISMap({
          basemap: "streets-navigation-vector"
        });
        this.view = new MapView({
          container: this.$el,
          map: map,
          center: [118.8, 32.05],
          zoom: 12
        });
      }
    );
  },
  beforeDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
};
</script>
<style scoped>
.Map {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>