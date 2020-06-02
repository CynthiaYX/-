<template>
  <div class="LeftSide">
    <div id="online" @click="showPeople">
      <div style></div>
      <p>在线人员</p>
    </div>
    <!--         <div id="path" @click="showPathBox">
      <div></div>
      <p>作业点轨迹</p>
    </div>-->
    <div id="project" @click="projectHandler">
      <div></div>
      <p>项目管理</p>
    </div>
    <!-- <div id="member" @click="showMemberBox">
      <div></div>
      <p>人员管理</p>
    </div>-->
    <div id="layers" @click="treeControl">
      <div></div>
      <p>切换图层</p>
    </div>
    <div id="createProject" @click="createProjectDialog">
      <div></div>
      <p>标绘任务</p>
    </div>
    <div class="searchbox" v-if="path">
      <p>作业点轨迹查询</p>
      <div class="search">
        <date-picker
          id="date-picker"
          v-model="time"
          value-type="YYYY/M/D"
          format="YYYY-MM-DD"
          placeholder="选择日期"
          range="true"
        ></date-picker>
        <div>
          <button @click="search">查询</button>
          <button @click="output">导出shp</button>
        </div>
      </div>
    </div>
    <div class="memberbox" v-if="member">
      <p>人员管理</p>
      <div id="membersearch">
        <input type="text" placeholder="输入姓名" />
        <button>查询</button>
      </div>
      <ul class="card">
        <li>
          <span>仇宇轩</span>
          <button>详情</button>
          <ul class="memberdetail">
            <li>部门：</li>
            <li>进行中项目：</li>
            <li>联系电话：</li>
          </ul>
        </li>
      </ul>
    </div>
    <el-dialog
      :visible.sync="dialogProjectVisible"
      width="60%"
      id="projectDialog"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div slot="title">{{"今日" + projectList.length+"个项目开工"}}</div>
      <el-card
        v-for="(project,index) in showProjectList"
        :key="index"
        :body-style="{ padding: '10px'}"
      >
        <div @click="showDetail(project.FGUID)" class="projectList">
          <h3>
            {{project["项目名称"] }}
            <i class="el-icon-arrow-right"></i>
          </h3>
          <div>{{"任务书：" + project["委托合同号"]}}</div>
          <div>{{"案件号：" + project["案件号"]}}</div>
          <el-popover title="签到人" width="150" trigger="hover" :content="name">
            <span slot="reference" @mouseover="signInPerson(project.FGUID)">
              {{"今日签到" + project.NUM + "人 "}}
              <!-- 不返回0 -->
            </span>
          </el-popover>
          <span>{{"已开工：" + project.KGTS + "天"}}</span>
        </div>
      </el-card>
      <el-pagination
        layout="total,prev, pager, next"
        :total="projectList.length"
        :current-page.sync="currentPage"
        :page-size="5"
        @current-change="pagination"
      ></el-pagination>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogDetailVisible"
      width="60%"
      id="dialogDetail"
      :show-close="false"
      :modal="false"
      class="projectDetail"
    >
      <div class="detail">
        <div class="detailhead">
          <p v-cloak>{{detailList["项目名称"]}}</p>
          <span></span>
          <a href="#">轨迹导出</a>
        </div>
        <ul>
          <li v-cloak>案件号：{{detailList["案件号"]}}</li>
          <li v-cloak>委托合同号：{{detailList["委托合同号"]}}</li>
          <li v-cloak>委托单位：{{detailList["委托单位"]}}</li>
          <li v-cloak>工程等级：{{detailList["工程等级"]}}</li>
          <li v-cloak>细分类型：{{detailList["细分业务类别"]}}</li>
          <li v-cloak>承接部门：{{detailList["业务承接部门"]}}</li>
          <li v-cloak>生产部门：{{detailList["生产部门"]}}</li>
          <li v-cloak>需求：{{detailList["项目需求"]}}</li>
          <li v-cloak>联系人：{{detailList["联系人"]}}</li>
          <li v-cloak>创建人：{{detailList["创建人"]}}</li>
          <li v-cloak>开工日期：{{detailList["开工日期"]}}</li>
          <li v-cloak>项目地址：{{detailList["项目地址"]}}</li>
          <li v-cloak>
            项目图片:
            <el-image
              :preview-src-list="srcList"
              style="width: 150px; height: 150px"
              lazy
              :src="url"
            >
              <div slot="error">
                <i class="el-icon-picture"></i>
              </div>
            </el-image>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
      title="今日在线名单"
      :visible.sync="dialogPeopleVisible"
      width="60%"
      :modal="false"
      id="peopleDialog"
      :close-on-click-modal="false"
    >
      <el-card v-for="(people,index) in peopleList" :key="index" :body-style="{ padding: '10px'}">
        <div>
          <h3>
            {{people.REALNAME }}
            <i class="el-icon-arrow-right"></i>
          </h3>
          <div>{{people.TIME}}</div>
          <!-- 只需要时分 -->
          <span>{{ people.COMPNAME +"--"}}</span>
          <span>{{ people.DEPTNAME}}</span>
        </div>
      </el-card>
    </el-dialog>
    <el-drawer :visible.sync="drawer" size="20%" title="图层展示">
      <el-tree
        id="tree"
        node-key="id"
        :data="layers"
        :props="defaultProps"
        accordion
        :indent="25"
        :highlight-current="true"
        @check="layerControl"
        show-checkbox
        :render-content="renderContent"
      ></el-tree>
    </el-drawer>
    <el-dialog
      title="创建任务"
      :visible.sync="dialogCreateVisible"
      :modal="false"
      class="creatProject"
      :close-on-click-modal="false"
    >
      <el-tabs :stretch="true">
        <el-tab-pane label="问题点" @click="paneName = '问题点'">
          <el-form label-width="70px">
            <el-form-item label="任务名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="问题描述">
              <el-input></el-input>
            </el-form-item>
            <el-upload
              class="upload-demo"
              drag
              action="http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=FileUpload"
              multiple
            >
              <!-- 修改地址 -->
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="问题面" @click="paneName = '问题面'">
          <el-form label-width="70px">
            <el-form-item label="任务名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="问题描述">
              <el-input></el-input>
            </el-form-item>
            <el-upload
              class="upload-demo"
              drag
              action="http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=FileUpload"
              multiple
            >
              <!-- 修改地址 -->
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="任务面" @click="paneName = '任务面'">
          <el-form label-width="70px" :inline="true" class="creatForm">
            <el-form-item label="案件号">
              <el-input v-model="projectDetail.taskcode"></el-input>
            </el-form-item>
            <el-form-item label="合同号">
              <el-input v-model="projectDetail.taskbook"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
              <el-input v-model="projectDetail.taskname"></el-input>
            </el-form-item>
            <el-form-item label="委托单位">
              <el-input v-model="projectDetail.entrustdept"></el-input>
            </el-form-item>
            <el-form-item label="细分类型">
              <el-input v-model="projectDetail.typedetail"></el-input>
            </el-form-item>
            <el-form-item label="承接部门">
              <el-input v-model="projectDetail.acceptdept"></el-input>
            </el-form-item>
            <el-form-item label="生产部门">
              <el-input v-model="projectDetail.workdept"></el-input>
            </el-form-item>
            <el-form-item label="项目地址">
              <el-input v-model="projectDetail.taskadress"></el-input>
            </el-form-item>
            <el-form-item label="需求">
              <el-input v-model="projectDetail.requirement"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="projectDetail.contacts"></el-input>
            </el-form-item>
            <el-form-item id="select" label="工程等级">
              <el-select v-model="projectDetail.tasklevel">
                <el-option label="特级工程" value="特级工程"></el-option>
                <el-option label="一级工程" value="一级工程"></el-option>
                <el-option label="二级工程" value="二级工程"></el-option>
                <el-option label="三级工程" value="三级工程"></el-option>
              </el-select>
            </el-form-item>

            <el-upload
              class="upload-demo"
              drag
              action="http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=FileUpload"
              multiple
            >
              <!-- 修改地址 -->
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" @click="createProject()">提交任务</el-button>
      </div>
    </el-dialog>
    <el-button-group id="drawTool" v-if="dialogCreateVisible">
      <button id="Multipoint">点</button>
      <button id="Polygon">多边形</button>
      <button id="FreehandPolygon">自定义多边形</button>
    </el-button-group>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";
import { loadModules } from "esri-loader";
import esriLoader from "esri-loader";
import store from "../store.js";
export default {
  data() {
    return {
      path: false,
      member: false,
      drawer: false,
      time: null,
      paneName: "问题点",
      dialogProjectVisible: false,
      dialogDetailVisible: false,
      dialogPeopleVisible: false,
      dialogCreateVisible: false,
      projectList: [],
      showProjectList: [],
      detailList: [],
      peopleList: [],
      name: "",
      url: "",
      srcList: [],
      currentPage: 1,
      projectDetail: {
        taskcode: "",
        taskbook: "",
        entrustdept: "",
        taskname: "",
        taskadress: "",
        requirement: "",
        contacts: "",
        tasklevel: "",
        typedetail: "",
        acceptdept: "",
        workdept: ""
      },
      problemDetail: {
        probname: "",
        probdetail: "",
        submituser: ""
      },
      layers: [],
      layerIcon: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  components: { DatePicker },
  methods: {
    showPathBox: function() {
      this.path = !this.path;
    },
    showMemberBox: function() {
      this.member = !this.member;
    },
    showPeople() {
      this.dialogPeopleVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=getUserLocate"
        )
        .then(response => {
          this.peopleList = response.data.result;
          this.drawPoint(this.peopleList);
        });
    },
    search() {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=getUserLocateHis&stime=" +
            this.time[0] +
            "&etime=" +
            this.time[1]
        )
        .then(response => {
          this.drawMultPoint(response.data.result);
        });
    },
    output() {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=exportUserLocateHis&stime=" +
            this.time[0] +
            "&etime=" +
            this.time[1]
        )
        .then(response => {
          window.open("http://58.213.48.104/JNSERVICE/" + response.data.result);
        });
    },
    projectHandler() {
      this.dialogProjectVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getporjlisttoday"
        )
        .then(response => {
          this.projectList = response.data.source;
          this.showProjectList = this.projectList.slice(
            (this.currentPage - 1) * 5,
            this.currentPage * 5
          );
        });
    },
    signInPerson(fguid) {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getclockusrtodaybyid&fguid=" +
            fguid
        )
        .then(response => {
          this.name = response.data.source;
        });
    },
    treeControl() {
      this.axios
        .get(
          "http://58.213.48.104/arcgis/rest/services/%E5%8D%8F%E5%90%8C%E9%87%87%E9%9B%86/problem1/MapServer/legend?f=pjson"
        )
        .then(response => {
          let tmp = new Array();
          for (let i = 0; i < response.data.layers.length; i++) {
            tmp.push({
              id: response.data.layers[i].layerId,
              legend: response.data.layers[i].legend[0].url
            });
          }
          this.layerIcon = tmp;
        });
      let tmp = new Array();
      this.drawer = true;
      this.axios
        .get(
          "http://58.213.48.104/arcgis/rest/services/%E5%8D%8F%E5%90%8C%E9%87%87%E9%9B%86/problem1/MapServer?f=pjson"
        )
        .then(response => {
          for (let i = 0; i < response.data.layers.length; i++) {
            /* !!!!! */
            if (response.data.layers[i].parentLayerId == -1) {
              tmp.push({
                id: response.data.layers[i].id,
                name: response.data.layers[i].name
              });
              let tmpOutter;
              let tmpInner = new Array();
              tmpOutter = i;
              if (i < response.data.layers.length - 1) {
                while (
                  response.data.layers[i + 1].parentLayerId ==
                  response.data.layers[tmpOutter].id
                ) {
                  tmpInner.push({
                    id: response.data.layers[i + 1].id,
                    name: response.data.layers[i + 1].name
                  });
                  i++;
                  let tmpInOutter = i;
                  let tmpInInner = new Array();
                  if (i < response.data.layers.length - 1) {
                    while (
                      response.data.layers[i + 1].parentLayerId ==
                      response.data.layers[tmpInOutter].id
                    ) {
                      tmpInInner.push({
                        id: response.data.layers[i + 1].id,
                        name: response.data.layers[i + 1].name
                      });
                      i++;
                    }
                  }
                  tmpInner[tmpInner.length - 1].children = tmpInInner;
                }
              }
              tmp[tmp.length - 1].children = tmpInner;
            }
          }
          this.layers = tmp;
        });
    },
    layerControl(data, checked) {
      const options = {
        url: "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/init.js"
      };
      esriLoader.loadCss(
        "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/esri/css/esri.css"
      );
      esriLoader.loadCss(
        "http://58.213.48.104/arcgis_js_api/library/3.27/3.27/dijit/themes/claro/claro.css"
      );
      loadModules(["esri/layers/ArcGISDynamicMapServiceLayer"], options)
        .then(([ArcGISDynamicMapServiceLayer]) => {
          const map = store.state.map;
          const showLayer = new ArcGISDynamicMapServiceLayer(
            "http://58.213.48.104/arcgis/rest/services/协同采集/problem1/MapServer/"
          );
          map.addLayers([showLayer]);
          showLayer.setVisibleLayers(checked.checkedKeys);/* 无法清除图层 */
        })
        .catch(err => {
          console.log(err);
        });
    },
    createProjectDialog() {
      this.dialogCreateVisible = true;
      this.realDraw();
    },
    createProject() {
      this.dialogCreateVisible = false;
      switch (this.paneName) {
        case "问题点":
          {
            this.axios.get(
              "http://http://58.213.48.104/JNSERVICE/DLService.ashx?action=insertprobForWeb&state=未处理&type=point&probtype=问题点&probname=" +
              this.problemDetail.probname +
              "&probdetail=" +
              this.problemDetail.probdetail +
              "&pics= " /* 图片 */ +
                "&geostr=" +
                store.state.geo +
                "&submituser=" + store.state.user
            );
          }
          break;
        case "问题面":
          {
            this.axios.get(
              "http://http://58.213.48.104/JNSERVICE/DLService.ashx?action=insertprobForWeb&state=未处理&type=polygon&probtype=问题面&probname=" +
              this.problemDetail.probname +
              "&probdetail=" +
              this.problemDetail.probdetail +
              "&pics= " /* 图片 */ +
                "&geostr=" +
                store.state.geo +
                "&submituser=" + store.state.user
            );
          }
          break;
        case "任务面": {
          {
            this.axios.get(
              "http://http://58.213.48.104/JNSERVICE/DLService.ashx?action=insertTaskForWeb&taskcode=" +
              this.projectDetail.taskcode +
              "&taskbook=" +
              this.projectDetail.taskbook +
              "&entrustdept=" +
              this.projectDetail.entrustdept +
              "&taskname=" +
              this.projectDetail.taskname +
              "&taskadress=" +
              this.projectDetail.taskadress +
              "&requirement=" +
              this.projectDetail.requirement +
              "&contacts=" +
              this.projectDetail.contacts +
              "&tasklevel=" +
              this.projectDetail.tasklevel +
              "&typedetail=" +
              this.projectDetail.typedetail +
              "&acceptdept=" +
              this.projectDetail.acceptdept +
              "&workdept=" +
              this.projectDetail.workdept +
              "&pics= " /* 图片 */ +
                "&geostr=" +
                store.state.geo +
                "&submituser=" +store.state.user
            );
          }
          break;
        }
      }
    },
    showDetail(fguid) {
      this.dialogDetailVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getporjdetailbyid&fguid=" +
            fguid
        )
        .then(response => {
          this.detailList = response.data.source;
          this.drawPolygon(
            response.data.source.GEO.slice(12, -2)
              .split(",")
              .map(item => {
                return item.trim().split(" ");
              })
          );
        });
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getporjpicsbyid&fguid=" +
            fguid
        )
        .then(response => {
          let tmp = new Array();
          tmp = response.data.source.split(";").filter(function(e) {
            return e != "";
          });
          for (let i = 0; i < tmp.length; i++) {
            this.srcList.push(
              ("http://58.213.48.104/JNSERVICE/" + tmp[i]).replace(/\\/g, "/")
            );
          }
          this.url = this.srcList[0];
        });
    },
    pagination() {
      this.showProjectList = this.projectList.slice(
        (this.currentPage - 1) * 5,
        this.currentPage * 5
      );
    },
    drawPoint(pointXY) {
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
          "esri/graphic",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/geometry/Point"
        ],
        options
      )
        .then(([Graphic, SimpleMarkerSymbol, Point]) => {
          const map = store.state.map;
          map.graphics.clear();
          for (let i = 0; i < pointXY.length; i++) {
            var geometry = new Point(pointXY[i].X, pointXY[i].Y);
            var symbol = new SimpleMarkerSymbol();
            /* 添加infoWindow */
            var gra = new Graphic(geometry, symbol);
            map.graphics.add(gra);
          }
        })
        .catch(err => {
          // handle any script or module loading errors
          console.error(err);
        });
    },
    drawMultPoint(pointXY) {
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
          "esri/graphic",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/geometry/Multipoint",
          "esri/Color"
        ],
        options
      )
        .then(
          ([
            Graphic,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            Multipoint,
            Color
          ]) => {
            const map = store.state.map;
            map.graphics.clear();
            for (let i = 0; i < pointXY.length; i++) {
              var r = Math.floor(Math.random() * 256);
              var g = Math.floor(Math.random() * 256);
              var b = Math.floor(Math.random() * 256);
              var mpJson = { points: pointXY[i] };
              var geometry = new Multipoint(mpJson);
              var symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                10,
                new SimpleLineSymbol(),
                new Color([r, g, b, 0.25])
              );
              /* 添加infoWindow */
              var gra = new Graphic(geometry, symbol);
              map.graphics.add(gra);
            }
          }
        )
        .catch(err => {
          // handle any script or module loading errors
          console.error(err);
        });
    },
    drawPolygon(polygonXY) {
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
          "esri/graphic",
          "esri/symbols/SimpleFillSymbol",
          "esri/geometry/Polygon"
        ],
        options
      )
        .then(([Graphic, SimpleFillSymbol, Polygon]) => {
          const map = store.state.map;
          map.graphics.clear();
          var geometry = new Polygon(polygonXY);
          geometry.setSpatialReference(map.spatialReference);
          var symbol = new SimpleFillSymbol();
          var gra = new Graphic(geometry, symbol);
          map.graphics.add(gra);
          map.setExtent(geometry.getExtent(), true);
        })
        .catch(err => {
          // handle any script or module loading errors
          console.error(err);
        });
    },
    realDraw() {
      var map, tb;
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
          "esri/toolbars/draw",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          "esri/symbols/PictureFillSymbol",
          "esri/symbols/CartographicLineSymbol",
          "esri/graphic",
          "esri/Color",
          "dojo/dom",
          "dojo/on",
          "dojo/domReady!"
        ],
        options
      )
        .then(
          ([
            Draw,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            PictureFillSymbol,
            CartographicLineSymbol,
            Graphic,
            Color,
            dom,
            on
          ]) => {
            map = store.state.map;

            // markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples
            var markerSymbol = new SimpleMarkerSymbol();
            markerSymbol.setPath(
              "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z"
            );
            markerSymbol.setColor(new Color("#00FFFF"));

            // lineSymbol used for freehand polyline, polyline and line.
            var lineSymbol = new CartographicLineSymbol(
              CartographicLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]),
              10,
              CartographicLineSymbol.CAP_ROUND,
              CartographicLineSymbol.JOIN_MITER,
              5
            );

            // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
            // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
            var fillSymbol = new PictureFillSymbol(
              /* 填充色 */
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color("#000"),
                1
              ),
              42,
              42
            );

            tb = new Draw(map);
            tb.on("draw-end", function(evt) {
              //deactivate the toolbar and clear existing graphics
              tb.deactivate();
              map.enableMapNavigation();

              // figure out which symbol to use
              var symbol;
              if (
                evt.geometry.type === "point" ||
                evt.geometry.type === "multipoint"
              ) {
                symbol = markerSymbol;
                store.commit("setGeo", evt.geometry.points);
              } else if (
                evt.geometry.type === "line" ||
                evt.geometry.type === "polyline"
              ) {
                symbol = lineSymbol;
                store.commit("setGeo", evt.geometry.paths);
              } else {
                symbol = fillSymbol;
                store.commit("setGeo", evt.geometry.rings);
              }
              map.graphics.add(new Graphic(evt.geometry, symbol));
            });

            // event delegation so a click handler is not
            // needed for each individual button
            on(dom.byId("drawTool"), "click", function(evt) {
              map.graphics.clear();
              if (evt.target.id === "drawTool") {
                return;
              }
              var tool = evt.target.id.toLowerCase();
              map.disableMapNavigation();
              tb.activate(tool);
            });
          }
        )
        .catch(err => {
          // handle any script or module loading errors
          console.error(err);
        });
    },
    renderContent(h, { node, data }) {
      let tmp;
      for (let i = 0; i < this.layerIcon.length; i++) {
        if (this.layerIcon[i].id == data.id) {
          tmp =
            "http://58.213.48.104/arcgis/rest/services/%E5%8D%8F%E5%90%8C%E9%87%87%E9%9B%86/problem1/MapServer/" +
            data.id +
            "/images/" +
            this.layerIcon[i].legend;
          break;
        }
      }
      return (
        <span class="custom-tree-node">
          <img src={tmp}></img>
          <span>{node.label}</span>
        </span>
      );
    }
  }
};
</script>
<style >
* {
  margin: 0px;
  padding: 0px;
}
.LeftSide {
  padding-top: 5px;
  position: absolute;
  top: 60px;
  right: 60px;
}
#online,
#path,
#project,
#member,
#layers,
#createProject {
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
  width: 50px;
  height: 50px;
  margin: 5px;
  font-size: 9px;
  background: white;
}
#online div {
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/天数.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  left: 2.5px;
}
#path div {
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/轨迹.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  left: 2.5px;
}
#project div {
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/项目管理.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  left: 2.5px;
}
#member div {
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/人员.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  left: 2.5px;
}
#layers div {
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/人员.png); /* 换个图标 */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  left: 2.5px;
}
#createProject div {
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/人员.png); /* 换个图标 */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  left: 2.5px;
}
#online p,
#path p,
#project p,
#member p,
#layers p,
#createProject p {
  position: relative;
  bottom: 2px;
}
.searchbox {
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
  width: 250px;
  height: 150px;
  margin-left: 10px;
  padding-top: 5px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2px;
}
.searchbox p {
  height: 17%;
}
#date-picker {
  width: 90%;
}
.search {
  width: 100%;
  border-top: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-top-width: 1px;
  padding-top: 15px;
}
.search button {
  width: 35%;
  background-color: rgba(0, 0, 0, 0.15);
  border: none;
  font-size: 14px;
  padding: 9px;
  margin: 10px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
}
.memberbox {
  height: 200px;
  width: 75%;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.memberbox p {
  position: relative;
  top: 5px;
}
#membersearch {
  border-top: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-top-width: 1px;
  padding-top: 10px;
  margin-top: 10px;
}
.memberbox input {
  position: absolute;
  left: 20px;
  height: 24px;
  border: solid rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  padding-left: 10px;
}
#membersearch button {
  position: relative;
  left: 90px;
  background-color: #3286fec2;
  border: none;
  font-size: 12px;
  color: white;
  padding: 5px 15px;
  border-radius: 3px;
}
.card {
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 90%;
  left: 5%;
  margin-bottom: 5px;
  border-radius: 2px;
}
.card li {
  list-style-type: none;
  margin: 10px 0px 5px 0px;
  background: #d4e7fb;
  text-align: left;
  border-radius: 2px;
}
.card span {
  position: relative;
  left: 20px;
  font-size: 18px;
}
.card button {
  position: relative;
  left: 150px;
  background-color: #8f9ce2c2;
  border: none;
  font-size: 10px;
  color: white;
  padding: 3px 7px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  border-radius: 3px;
}
.memberdetail {
  padding-bottom: 5px;
}
.memberdetail li {
  margin: 3px 20px;
  background: transparent;
}
#peopleDialog .el-dialog,
#projectDialog .el-dialog,
.creatProject .el-dialog,
.projectDetail .el-dialog {
  display: flex;
  position: absolute;
  right: 130px;
  flex-direction: column;
  max-height: 81%;
  overflow-x: hidden;
  text-align: left;
}
#peopleDialog .el-dialog__body {
  padding: 10px 0px;
}
#dialogDetail .el-dialog__header {
  padding: 0px;
}
#dialogDetail .el-dialog__body {
  padding: 0px;
}
.detail {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.detailhead {
  padding: 5px 0px;
  background-color: #3287fec2;
  border-radius: 2px;
  color: white;
}
.detailhead span {
  display: inline-block;
  position: relative;
  right: -35%;
  width: 10px;
  height: 10px;
  background-image: url(../assets/下载.png);
  background-repeat: no-repeat;
  background-position: center;
}
.detailhead a {
  font-size: 11px;
  position: relative;
  right: -37%;
}
.detail li {
  padding: 7px;
  margin: 0px 8px;
  font-size: 13px;
  list-style-type: none;
  text-align: left;
  border-bottom: dashed;
  border-bottom-color: rgba(0, 0, 0, 0.2);
}
#tree {
  margin: 50px 15px;
}
#tree .el-tree-node__label {
  font-size: 18px;
}
#select {
  position: relative;
  left: -138px;
}
#projectDialog .el-dialog__header {
  text-align: left;
}
#projectDialog .el-dialog__body {
  padding: 0px;
}
.projectList {
  text-align: left;
}
#projectDialog .el-pagination .el-icon-arrow-right {
  bottom: 7px;
}
.creatProject .el-dialog {
  text-align: center;
  width: 600px;
  margin: 0px;
}
.creatForm .el-input__inner {
  width: 190px;
  font-size: 15px;
}
#drawTool {
  position: fixed;
  top: 200px;
  right: 750px;
}
#drawTool button {
  padding: 5px 10px;
}
.LeftSide .el-dialog__wrapper {
  width: 750px;
  left: auto;
}
</style>