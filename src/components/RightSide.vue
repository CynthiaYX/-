<template>
  <div class="RightSide">
    <span>
      <input
        class="searchbox"
        type="text"
        placeholder="项目查询"
        v-model="projectSearch"
        @keyup="associatingInputing"
      />
    </span>
    <button></button>
    <ul v-if="pullDownShow" class="pulldown">
      <li :key="index" v-for="(project,index) in searchResult" @click="detail(project)">
        <span class="redpin"></span>
        <p>{{project.name}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { loadModules } from "esri-loader";
export default {
  data() {
    return {
      projectSearch: "",
      searchResult: [],
      pullDownShow: false,
      modules: {},
      polygon: {
        type: "polygon",
        rings: []
      }
    };
  },
  methods: {
    associatingInputing() {
      this.pullDownShow = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=searchproj&keyword=" +
            this.projectSearch
        )
        .then(response => {
          this.searchResult = response.data.source;
          /* 空值返回的不是空列表 */
        });
    },
    detail(project) {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getprojbyid&table=jn_gldy&fguid=" +
            project.fguid
        )
        .then(response => {
          this.polygon.rings = response.data.source;
          console.log(this.polygon);
          this.draw();
          console.log(this.modules);
          this.modules.polygonGraphic.geometry = this.polygon;
          this.modules.graphicsLayer.add(this.modules.polygonGraphic);
        });
    },
    draw() {
      this.modules = new loadModules(
        ["esri/Map", "esri/Graphic", "esri/layers/GraphicsLayer"],
        { css: true }
      ).then(([ArcGISMap, GraphicsLayer, Graphic]) => {
        const map = new ArcGISMap({
          basemap: "streets-navigation-vector"
        });
        var graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);
        var polygonGraphic = new Graphic({
          geometry: {},
          symbol: {
            type: "simple-fill",
            color: [227, 139, 79, 0.8], // orange, opacity 80%
            outline: {
              color: [255, 255, 255],
              width: 1
            }
          }
        });
        graphicsLayer.add(polygonGraphic);
      });
    }
  }
};
</script>
<style scoped>
* {
  padding: 0px;
  margin: 0px;
}
.RightSide {
  width: 40%;
  height: 80%;
  position: absolute;
  top: 80px;
  right: 0px;
}
.searchbox {
  position: relative;
  height: 35px;
  width: 250px;
  left: 10px;
  border: none;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  padding: 0px 10px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2px;
}
button {
  position: relative;
  height: 35px;
  width: 50px;
  right: -10px;
  top: 13px;
  border: none;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.pulldown {
  /* display: none; */
  position: relative;
  left: 20.5%;
  width: 50%;
  list-style-type: none;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  padding: 15px 8px 5px 8px;
}
.pulldown li {
  border-bottom: dashed;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  padding-bottom: 10px;
}
.redpin {
  float: left;
  width: 25px;
  height: 20px;
  background-image: url(../assets/定位位置.png);
  background-repeat: no-repeat;
  background-position: center;
}
.pulldown p {
  margin-left: 25px;
  text-align: left;
}
</style>