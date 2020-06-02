<template>
  <div id="Map">
    <el-button-group id="switch">
      <el-button plain type="primary" @click="yingxiang">影像</el-button>
      <el-button plain type="primary" @click="ditu">地图</el-button>
    </el-button-group>
  </div>
</template>
<script>
import store from "../store.js";
import Vue from "vue";
import esriLoader from "esri-loader";
import { loadModules } from "esri-loader";
export default {
  /*   data(){
    return{
      basemapLayerService:"http://58.213.48.106/arcgis/rest/services/NJ08/NJDXT20180830/MapServer"
    }
  }, */
  methods: {
    ditu() {
      const options = {
        url: "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/init.js"
      };
      esriLoader.loadCss(
        "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/esri/css/esri.css"
      );
      esriLoader.loadCss(
        "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/dijit/themes/claro/claro.css"
      );
      loadModules([], options)
        .then(() => {
          const map = store.state.map;
          map.getLayer("YingxiangMap").setVisibility(false);
          map.getLayer("BaseMap").setVisibility(true);
        })
        .catch(err => {
          console.log(err);
        });
    },
    yingxiang() {
      const options = {
        url: "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/init.js"
      };
      esriLoader.loadCss(
        "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/esri/css/esri.css"
      );
      esriLoader.loadCss(
        "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/dijit/themes/claro/claro.css"
      );
      loadModules([], options)
        .then(() => {
          const map = store.state.map;
          map.getLayer("BaseMap").setVisibility(false);
          map.getLayer("YingxiangMap").setVisibility(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    const options = {
      url: "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/init.js"
    };
    esriLoader.loadCss(
      "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/esri/css/esri.css"
    );
    esriLoader.loadCss(
      "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/dijit/themes/claro/claro.css"
    );
    loadModules(
      [
        "esri/map",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/dijit/Popup",
        "dojo/dom-construct"
      ],
      options
    )
      .then(
        ([
          Map,
          ArcGISTiledMapServiceLayer,
          SimpleFillSymbol,
          SimpleLineSymbol,
          Color,
          Popup,
          domConstruct
        ]) => {
          var popup = new Popup(
            {
              fillSymbol: new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([255, 0, 0]),
                  2
                ),
                new Color([255, 255, 0, 0.25])
              )
            },
            domConstruct.create("div")
          );
          const map = new Map("Map", {
            logo: false,
            slider: false,
            zoom: 4,
           /*  center: [118.275, 42.573]  主城六区坐标 , */
            infoWindow: popup
          });
          Vue.set(store.state, "map", map);
          const basemaplayer = new ArcGISTiledMapServiceLayer(
            "http://58.213.48.106/arcgis/rest/services/NJ08/NJDXT20180830/MapServer"
          );
          const yingxiangmaplayer = new ArcGISTiledMapServiceLayer(
            "http://58.213.48.104/arcgis/rest/services/NJ08/NJ08dom1M/MapServer"
          );
          basemaplayer.id = "BaseMap";
          yingxiangmaplayer.id = "YingxiangMap";
          map.addLayers([basemaplayer, yingxiangmaplayer]);
          map.getLayer("YingxiangMap").setVisibility(false);
        }
      )
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style scoped>
#Map {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
#switch {
  position: absolute;
  bottom: 10px;
  right: 20px;
  z-index: 2;
}
</style>