<template>
  <div class="RightSide">
    <span>
      <input
        class="searchbox"
        type="text"
        placeholder="项目、人员、部门查询"
        v-model="projectSearch"
        @keyup="associatingInputing"
      />
    </span>
    <el-button type="primary" id="search">
      <i class="el-icon-search"></i> 搜索
    </el-button>
    <ul v-if="pullDownShow" class="pulldown">
      <li :key="index" v-for="(project,index) in searchResult" @click="detail(project)">
        <p>
          <i :class="iconSelect(project)"></i>
          {{ project.name}}
        </p>
      </li>
    </ul>
    <el-dialog
      :visible.sync="dialogProjectVisible"
      width="513px"
      class="project"
      :modal="false"
      @closed="searchBox=false,checkAll = false"
      :close-on-click-modal="false"
    >
      <div class="projectTitle" slot="title" :class="{isFinished:projectDetail['项目状态']=='已完工'}">
        <div v-if="rollBack" @click="timeTravel">
          <i class="el-icon-back"></i>
        </div>
        <div id="level" v-if="projectDetail['工程等级']=='三级工程'">3</div>
        <div id="level" v-else-if="projectDetail['工程等级']=='二级工程'">2</div>
        <div id="level" v-else-if="projectDetail['工程等级']=='一级工程'">1</div>
        <div id="level" v-else-if="projectDetail['工程等级']=='特级工程'">特</div>
        <h2>{{projectDetail["项目名称"]}}</h2>
        <h3>{{"["+projectDetail["委托合同号"]+"]"}}</h3>
        <div>{{"任务书号："+projectDetail["任务书号"]}}</div>
        <div>{{"委托单位："+projectDetail["委托单位"]}}</div>
        <div>{{"生产部门："+projectDetail["生产部门"]+"--"+projectDetail["业务承接部门"]}}</div>
        <div>{{"项目地址："+projectDetail["项目地址"]}}</div>
        <div>
          <i class="el-icon-phone"></i>
          {{"创建人："+projectDetail["创建人"]}}
        </div>
        <div>
          <i class="el-icon-phone"></i>
          {{"联系人："+projectDetail["联系人"]}}
        </div>
        <div>{{"项目于"+projectDetail["开工日期"]+"开工 开工"+projectDetail["开工天数"]+"天 签到"+projectDetail["作业天数"]+"天 投入"+projectDetail["投入人天"]+"人"}}</div>
      </div>
      <div>
        <el-image
          :preview-src-list="urls"
          lazy
          :src="url"
          v-for="url in srcList"
          :key="url"
          class="projectImage"
        >
          <div slot="error">
            <i class="el-icon-picture"></i>
          </div>
        </el-image>
        <div>
          <el-row class="functionButton">
            <el-button-group>
              <el-button size="medium" @click="finish(projectDetail['项目名称'])">项目完工</el-button>
              <el-button size="medium" @click="reDraw()">范围重绘</el-button>
              <el-button size="medium">
                <el-upload
                  class="upload"
                  :show-file-list="false"
                  action="/"
                  :limit="1"
                  :multiple="false"
                  :on-change="importBoundary"
                  :auto-upload="false"
                  :file-list="fileList"
                >范围导入</el-upload>
              </el-button>
              <!-- 功能有问题待测试 -->

              <el-button size="medium" @click="showSearch(projectDetail['项目名称'])">轨迹导出</el-button>
            </el-button-group>
          </el-row>
        </div>
        <el-collapse-transition>
          <div v-show="searchBox">
            <el-date-picker
              v-model="time"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              class="datePicker"
            ></el-date-picker>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              class="checkBox"
            >全选</el-checkbox>
            <el-button-group style="margin-left:5px">
              <el-button
                type="primary"
                icon="el-icon-map-location"
                style="padding:8px 12px"
                @click="projectGuiji"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-download"
                style="padding:8px 12px"
                @click="projectGuijiDownload"
              ></el-button>
            </el-button-group>
            <el-checkbox-group
              v-model="checkedPeople"
              @change="handleCheckedPeopleChange"
              class="checkPeople"
              v-if="persons.length!=0"
            >
              <el-checkbox v-for="(people,index) in persons" :label="people" :key="index">
                <div @click="showPeople(people)">
                  <i class="el-icon-user"></i>
                  {{people.name}}
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-collapse-transition>
      </div>
      <span slot="footer" class="projectFooter">
        <div class="projectButton1" @click="showProblem(projectDetail['项目名称'])">
          范围内问题
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="projectButton2" @click="showData(projectDetail['项目名称'])">
          范围内数据
          <i class="el-icon-arrow-right"></i>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogPeopleVisible"
      width="513px"
      class="people"
      :modal="false"
    >
      <div class="peopleTitle" slot="title">
        <div v-if="rollBack" @click="timeTravel" class="peopleBack">
          <i class="el-icon-back"></i>
        </div>
        <el-avatar id="headShot" shape="square" :size="120" :src="squareUrl"></el-avatar>
        <h2 id="name" v-text="peopleDetail.userdetail.REALNAME"></h2>
        <div>{{"部门："+peopleDetail.userdetail.DEPTNAME}}</div>
        <div>
          <i class="el-icon-phone"></i>
          {{"联系电话："+peopleDetail.userdetail.TELEPHONE}}
        </div>
        <h3>{{peopleDetail.userdetail.COMPNAME}}</h3>
        <div
          id="workOnline"
        >{{"参与"+peopleDetail.projdetail.length+"个项目 共在线"+peopleDetail.userdetail.onlinedays+"天"}}</div>
        <el-button class="peopleGuiji" type="primary" size="mini">轨迹</el-button>
        <!-- 确认轨迹功能 -->
      </div>
      <div>
        <el-card class="box-card">
          <div
            v-for="detail in peopleDetail.projdetail"
            :key="detail"
            class="text item"
            @click="showProject(detail)"
          >
            {{detail.name }}
            <el-button
              v-if="detail.stste=='作业中'"
              type="primary"
              plain
              size="mini"
              style="margin-left:20px;padding:5px 10px"
            >{{detail.stste}}</el-button>
            <el-button
              v-else-if="detail.stste=='已完工'"
              type="success"
              plain
              size="mini"
              style="margin-left:20px;padding:5px 10px"
            >{{detail.stste}}</el-button>
            <el-button
              v-else
              type="warning"
              plain
              size="mini"
              style="margin-left:20px;padding:5px 10px"
            >{{detail.stste}}</el-button>
            <i class="el-icon-arrow-right"></i>
          </div>
        </el-card>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogDepartmentVisible"
      width="513px"
      class="department"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div v-if="rollBack" @click="timeTravel">
          <i class="el-icon-back"></i>
        </div>
        <h2 class="departmentTitle">{{departmentName}}</h2>
      </div>
      <div>
        <div
          class="departmentProject"
        >{{"共"+departmentDetail.length +"个项目 - 进行中"+departmentNum[0]+"个 - 已完成"+departmentNum[1]+ "个 - 未进行"+departmentNum[2]+ "个 "}}</div>
        <el-card shadow="always" class="box-card">
          <div
            v-for="detail in departmentDetail"
            :key="detail"
            class="text item"
            @click="showProject(detail)"
          >
            {{detail.name}}
            <el-button
              v-if="detail.stste=='作业中'"
              type="primary"
              plain
              size="mini"
              style="margin-left:20px;padding:5px 10px"
            >{{detail.stste}}</el-button>
            <el-button
              v-else-if="detail.stste=='已完工'"
              type="success"
              plain
              size="mini"
              style="margin-left:20px;padding:5px 10px"
            >{{detail.stste}}</el-button>
            <el-button
              v-else
              type="warning"
              plain
              size="mini"
              style="margin-left:20px;padding:5px 10px"
            >{{detail.stste}}</el-button>
            <i class="el-icon-arrow-right"></i>
          </div>
        </el-card>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogProblemVisible"
      width="513px"
      class="problem"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div v-if="rollBack" @click="timeTravel">
          <i class="el-icon-back"></i>
        </div>
        <div>{{"共"+projectProblem.length + "个问题"}}</div>
        <el-button class="problemGuiji" type="primary" size="mini">轨迹</el-button>
        <!-- 功能待明确 -->
      </div>
      <div>
        <el-card shadow="always" class="box-card">
          <div v-for="(problem,index) in showProblemList" :key="index" class="text item">
            <div @click="showProblemDetail(problem.fguid)">
              {{problem.probname}}
              <el-button
                v-if="problem.state=='已处理'"
                type="success"
                plain
                size="mini"
                style="margin-left:20px;padding:5px 10px"
              >{{problem.state}}</el-button>
              <el-button
                v-else
                type="warning"
                plain
                size="mini"
                style="margin-left:20px;padding:5px 10px"
              >{{problem.state}}</el-button>
              <i class="el-icon-arrow-right"></i>
              <div class="problemDetail">{{problem.probdetail}}</div>
            </div>
          </div>
        </el-card>
        <el-pagination
          :hide-on-single-page="true"
          style="text-align:right"
          layout="prev, pager"
          :total="projectProblem.length"
          :current-page.sync="currentPage"
          :page-size="5"
          @current-change="pagination"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogCreateVisible"
      width="513px"
      class="create"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div v-if="rollBack" @click="timeTravel" class="createBack">
          <i class="el-icon-back"></i>
        </div>
        <h2>范围重绘</h2>
      </div>
      <el-form
        label-width="70px"
        :inline="true"
        label-position="left"
        class="projectCreate"
        v-model="projectDetail"
        ref="projectDetail"
      >
        <el-form-item label="案件号">
          <el-input v-model="projectDetail['委托合同号']"></el-input>
        </el-form-item>
        <el-form-item label="任务书号">
          <el-input v-model="projectDetail['任务书号']"></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="projectDetail['项目名称']"></el-input>
        </el-form-item>
        <el-form-item label="委托单位">
          <el-input v-model="projectDetail['委托单位']"></el-input>
        </el-form-item>
        <el-form-item label="项目地址">
          <el-input v-model="projectDetail['项目地址']"></el-input>
        </el-form-item>
        <el-form-item label="需求">
          <el-input v-model="projectDetail['需求']"></el-input>
        </el-form-item>
        <el-form-item label="承接部门">
          <el-input v-model="projectDetail['业务承接部门']"></el-input>
        </el-form-item>
        <el-form-item label="生产部门">
          <el-input v-model="projectDetail['生产部门']"></el-input>
        </el-form-item>
        <el-form-item label="上报人">
          <el-input v-model="projectDetail['创建人']"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="projectDetail['联系人']"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRedraw(projectDetail['项目名称'])">更新范围</el-button>
      </div>
    </el-dialog>
    <el-button-group id="info" v-if="dialogCreateVisible">
      <button id="Polygon">多边形</button>
      <button id="FreehandPolygon">自定义多边形</button>
    </el-button-group>
  </div>
</template>
<script>
import { loadModules } from "esri-loader";
import esriLoader from "esri-loader";
import store from "../store.js";
export default {
  data() {
    return {
      projectSearch: "",
      searchResult: [],
      pullDownShow: false,
      polygon: { rings: [] },
      dialogProjectVisible: false,
      dialogPeopleVisible: false,
      dialogDepartmentVisible: false,
      dialogProblemVisible: false,
      dialogCreateVisible: false,
      rollBack: false,
      searchBox: false,
      fileList: [],
      projectDetail: {
        委托单位: "",
        项目名称: "",
        项目地址: "",
        需求: "",
        联系人: "",
        业务承接部门: "",
        生产部门: "",
        地理坐标: ""
      },
      projectProblem: [],
      peopleDetail: {
        userdetail: {
          REALNAME: "",
          DEPTNAME: "",
          COMPNAME: "",
          TELEPHONE: "",
          onlinedays: ""
        },
        projdetail: {}
      },
      departmentNum: [],
      departmentDetail: [],
      srcList: [],
      urls: [],
      departmentName: "",
      buttonStyle: "",
      time: null,
      checkAll: false,
      checkedPeople: [],
      persons: {},
      isIndeterminate: false,
      currentPage: 1,
      showProblemList: [],
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    associatingInputing() {
      this.pullDownShow = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=ComprehensiveQuery&keyword=" +
            this.projectSearch
        )
        .then(response => {
          this.searchResult = response.data.source;
        });
    },
    detail(project) {
      store.commit("clearTravel");
      this.rollBack = false;
      console.log(store.state.travel);
      this.pullDownShow = false;
      switch (project.type) {
        case "项目":
          this.showProject(project);
          break;
        case "人员":
          this.showPeople(project);
          break;
        case "部门":
          this.showDepartment(project);
          break;
        case "管理单元":
          this.showUnit(project);
      }
    },
    showDepartment(project) {
      store.commit("timeTravel", "department");
      console.log(store.state.travel);
      if (store.state.travel.length > 1) this.rollBack = true;
      this.dialogDepartmentVisible = true;
      this.departmentName = project.name;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=getDeptDetail&deptname=" +
            project.fguid
        )
        .then(response => {
          this.departmentDetail = response.data.source.data;
          let tmp = new Array();
          for (let i = 0; i < 3; i++) {
            tmp.push(response.data.source.statis[i].num);
          }
          this.departmentNum = tmp;
        });
    },
    showProject(project) {
      store.commit("timeTravel", "project");
      console.log(store.state.travel);
      if (store.state.travel.length > 1) this.rollBack = true;
      this.dialogPeopleVisible = false;
      this.dialogDepartmentVisible = false;
      this.dialogProjectVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=getProjectDetail&fguid=" +
            project.fguid
        )
        .then(response => {
          this.projectDetail = response.data.source;
          let tmp1 = new Array();
          let tmp2 = new Array();
          tmp1 = this.projectDetail.pics.split(";").filter(function(e) {
            return e != "";
          });
          for (let i = 0; i < tmp1.length; i++) {
            tmp2.push(
              ("http://58.213.48.104/JNSERVICE/" + tmp1[i]).replace(/\\/g, "/")
            );
          }
          this.urls = tmp2;
          this.srcList = tmp2.slice(0, 3);
          this.polygon.rings = response.data.source["地理坐标"]
            .slice(12, -2)
            .split(",")
            .map(item => {
              return item.trim().split(" ");
            });
          console.log(this.polygon.rings);
          this.draw();
        });
    },
    showPeople(project) {
      store.commit("timeTravel", "people");
      console.log(store.state.travel);
      if (store.state.travel.length > 1) this.rollBack = true;
      this.dialogProjectVisible = false;
      this.dialogPeopleVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=getUserDetail&fguid=" +
            project.fguid
        )
        .then(response => {
          this.peopleDetail = response.data.source;
        });
    },
    showUnit(project) {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getprojbyid&table=jn_gldy&fguid=" +
            project.fguid
        )
        .then(response => {
          this.polygon.rings = response.data.source
            .slice(12, -2)
            .split(",")
            .map(item => {
              return item.trim().split(" ");
            });
          this.draw();
        });
    },
    finish(project) {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=ComprehensiveQuery&keyword=" +
            project
        )
        .then(response => {
          let id = "";
          id = response.data.source[0].fguid;
          this.axios
            .get(
              "http://58.213.48.104/JNSERVICE/DLService.ashx?action=projcomplete&taskid=" +
                id +
                "&userid=" +
                store.state.user
            )
            .then(this.projectDetail["工程等级"] == "已完工");
        });
    },
    reDraw() {
      store.commit("timeTravel", "draw");
      console.log(store.state.travel);
      if (store.state.travel.length > 1) this.rollBack = true;
      this.dialogProjectVisible = false;
      this.dialogCreateVisible = true;
      this.realDraw();
    },
    submitRedraw(project) {
      this.dialogCreateVisible = false;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=ComprehensiveQuery&keyword=" +
            project
        )
        .then(response => {
          let id = "";
          id = response.data.source[0].fguid;
          this.axios.get(
            "http://58.213.48.104/JNSERVICE/DLService.ashx?action=projchangesubmit&fguid=" +
              id +
              "&taskcode=" +
              this.projectDetail["委托合同号"] +
              "&taskbook=" +
              this.projectDetail["任务书号"] +
              "&entrustdept=" +
              this.projectDetail["委托单位"] +
              "&taskname=" +
              this.projectDetail["项目名称"] +
              "&taskadress=" +
              this.projectDetail["项目地址"] +
              "&requirement=" +
              this.projectDetail["需求"] +
              "&contacts=" +
              this.projectDetail["联系人"] +
              "&acceptdept=" +
              this.projectDetail["业务承接部门"] +
              "&workdept=" +
              this.projectDetail["生产部门"] +
              "&geostr=" +
              store.state.geo
          );
        });
    },
    importBoundary(file) {
      var that = this;
      var reader = new FileReader();
      reader.onload = function() {
        if (reader.result) {
          console.log(reader.result);
          var list = reader.result.split("\n");
          var plist = [];
          if (list.length > 2) {
            for (let i = 0; i < list.length; i++) {
              if (list[i].length > 5) {
                var poi = [];
                var psplit = list[i].split(",");
                poi.push(parseFloat(psplit[2]));
                poi.push(parseFloat(psplit[1]));
                plist.push(poi);
              }
            }
            if (plist.length > 3) {
              plist.push(plist[0]);
              that.polygon.rings = plist;
              that.draw();
            }
          } else {
            alert("文件解析出错，请检查坐标文件");
          }
          console.log(plist);
        }
      };
      reader.readAsText(file.raw);
    },
    handleCheckAllChange(val) {
      this.checkedPeople = val ? this.persons : [];
      this.isIndeterminate = false;
    },
    handleCheckedPeopleChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.persons.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.persons.length;
    },
    showSearch(project) {
      this.searchBox = !this.searchBox;
      if (this.searchBox) {
        this.axios
          .get(
            "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=ComprehensiveQuery&keyword=" +
              project
          )
          .then(response => {
            let id = "";
            id = response.data.source[0].fguid;
            this.axios
              .get(
                "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=getProjectClocker&fguid=" +
                  id
              )
              .then(response => {
                this.persons = response.data.source;
              });
          });
      }
    },
    projectGuiji() {
      let tmp = this.checkedPeople[0].ID;
      for (let i = 1; i < this.checkedPeople.length; i++) {
        tmp = tmp + ",";
        tmp = tmp + this.checkedPeople[i].ID;
      }
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=getClockUserLocateHis&userids=" +
            tmp +
            "&stime=" +
            this.time[0] +
            "&etime=" +
            this.time[1]
        )
        .then(response => {
          let tmp = new Array();
          for (var index in response.data.result) {
            tmp.push(response.data.result[index]);
          }
          this.drawMultPoint(tmp);
        });
    },
    projectGuijiDownload() {
      let tmp = this.checkedPeople[0].ID;
      for (let i = 1; i < this.checkedPeople.length; i++) {
        tmp = tmp + ",";
        tmp = tmp + this.checkedPeople[i].ID;
      }
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=exportColckUserLocateHis&userids=" +
            tmp +
            "&stime=" +
            this.time[0] +
            "&etime=" +
            this.time[1]
        )
        .then(response => {
          window.open("http://58.213.48.104/JNSERVICE/" + response.data.result);
        });
    },
    showProblem(project) {
      store.commit("timeTravel", "problem");
      console.log(store.state.travel);
      if (store.state.travel.length > 1) this.rollBack = true;
      this.dialogProjectVisible = false;
      this.dialogProblemVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=ComprehensiveQuery&keyword=" +
            project
        )
        .then(response => {
          let id = "";
          id = response.data.source[0].fguid;
          this.axios
            .get(
              "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=searchProbByProject&fguid=" +
                id
            )
            .then(response => {
              let tmp = new Array();
              for (let i = 0; i < response.data.source.length; i++) {
                if (response.data.source[i].type == "问题点") {
                  tmp.push(response.data.source[i]);
                }
              }
              this.projectProblem = tmp;
              this.showProblemList = tmp.slice(
                (this.currentPage - 1) * 5,
                this.currentPage * 5
              );
            });
        });
    },
    showData(project) {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=ComprehensiveQuery&keyword=" +
            project
        )
        .then(response => {
          let id = "";
          id = response.data.source[0].fguid;
          this.axios
            .get(
              "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=searchDataByProject&fguid=" +
                id
            )
            .then(response => {
              let tmp = new Array();
              for (let i = 0; i < response.data.source.length; i++) {
                tmp.push(
                  response.data.source[i].geo
                    .slice(9, -2)
                    .split(",")
                    .map(item => {
                      return item.trim().split(" ");
                    })
                );
              }
              this.drawMultPoint(tmp);
            });
        });
    },
    showProblemDetail(id) {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DYCHWeb.ashx?action=getgeostrbyid&fguid=" +
            id
        )
        .then(response => {
          if (response.data.source.slice(0, 7) == "POLYGON") {
            this.draw(response.data.source.slice(12, -2));
          } else {
            this.drawPoint(
              response.data.source
                .slice(9, -2)
                .split(",")
                .map(item => {
                  return item.trim().split(" ");
                })
            );
          }
        });
    },
    pagination() {
      this.showProblemList = this.projectProblem.slice(
        (this.currentPage - 1) * 5,
        this.currentPage * 5
      );
    },
    draw() {
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
          "esri/geometry/Polygon",
          "esri/SpatialReference"
        ],
        options
      )
        .then(([Graphic, SimpleFillSymbol, Polygon]) => {
          const map = store.state.map;
          map.graphics.clear();
          var geometry = new Polygon(this.polygon.rings);
          console.log(geometry);
          geometry.setSpatialReference(map.spatialReference);
          var symbol = new SimpleFillSymbol();
          var gra = new Graphic(geometry, symbol);
          map.graphics.add(gra);
          map.setExtent(geometry.getExtent());
        })
        .catch(err => {
          // handle any script or module loading errors
          console.error(err);
        });
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
          var geometry = new Point(pointXY[0]);
          geometry.setSpatialReference(map.spatialReference);
          var symbol = new SimpleMarkerSymbol();
          /* 添加infoWindow */
          var gra = new Graphic(geometry, symbol);
          map.graphics.add(gra);
          map.centerAt(geometry);
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
    iconSelect(project) {
      switch (project.type) {
        case "项目":
          return "el-icon-s-flag";
        case "人员":
          return "el-icon-s-custom";
        case "部门":
          return "el-icon-suitcase";
        case "管理单元":
          return "el-icon-place";
      }
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
            on(dom.byId("info"), "click", function(evt) {
              map.graphics.clear();
              if (evt.target.id === "info") {
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
    timeTravel() {
      switch (store.state.travel.pop() /* 非法使用 */) {
        case "project":
          this.dialogProjectVisible = false;
          break;
        case "department":
          this.dialogDepartmentVisible = false;
          break;
        case "people":
          this.dialogPeopleVisible = false;
          break;
        case "problem":
          this.dialogProblemVisible = false;
          break;
        case "draw":
          this.dialogCreateVisible = false;
          break;
      }
      if (store.state.travel.length <= 1) this.rollBack = false;
      switch (store.state.travel[store.state.travel.length - 1]) {
        case "project":
          this.dialogProjectVisible = true;
          break;
        case "department":
          this.dialogDepartmentVisible = true;
          break;
        case "people":
          this.dialogPeopleVisible = true;
          break;
        case "problem":
          this.dialogProblemVisible = true;
          break;
        case "draw":
          this.dialogCreateVisible = true;
          break;
      }
    }
  }
};
</script>
<style>
* {
  padding: 0px;
  margin: 0px;
}
.RightSide {
  position: absolute;
  top: 100px;
  left: -50px;
}
.searchbox {
  position: relative;
  font-size: 16px;
  height: 50px;
  width: 400px;
  left: 150px;
  border: none;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  padding: 0px 10px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2px;
}
#search {
  position: relative;
  height: 51px;
  left: 150px;
  font-size: 16px;
}
.pulldown {
  /* display: none; */
  position: relative;
  left: 159px;
  width: 515px;
  list-style-type: none;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.pulldown li {
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  padding: 15px 0px 10px 0px;
  margin: 0px 8px;
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
  margin-left: 10px;
  text-align: left;
}
.people .el-card__body,
.department .el-card__body,
.problem .el-card__body {
  padding: 0px;
  text-align: left;
}
.people .item {
  padding: 10px 20px;
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
}
.box-card {
  width: 99.6%;
}
.project .el-dialog,
.department .el-dialog,
.people .el-dialog,
.problem .el-dialog,
.create .el-dialog {
  display: flex;
  position: absolute;
  top: 5px;
  left: 110px;
  flex-direction: column;
  max-height: 70%;
  overflow-x: hidden;
}
.project .el-dialog__header,
.people .el-dialog__header {
  padding: 0px;
}
.problem .el-dialog__header,
.create .el-dialog__header {
  padding: 15px 20px;
}
.department .el-dialog__header {
  color: rgb(255, 255, 255);
  background-color: rgb(83, 141, 213);
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  padding: 20px 20px;
}
.projectTitle {
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  padding: 20px 20px;
  color: rgb(255, 255, 255);
  background-color: rgb(83, 141, 213);
}
.projectTitle div,
.projectTitle h2,
.projectTitle h3 {
  text-align: left;
  padding: 2px 0px;
}
#level {
  position: absolute;
  font-family: "Courier New", Courier, monospace;
  font-size: 150px;
  font-weight: bold;
  right: 30px;
  top: 65px;
  width: 20%;
  height: 25%;
}
.project .el-dialog__body {
  padding: 0px;
}
.functionButton {
  width: 100%;
  border-top: dashed;
  border-bottom: dashed;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
}
.functionButton .el-button--medium {
  padding: 10px 35px;
}

.checkPeople {
  border-top: dashed;
  border-bottom: dashed;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.3);
  position: relative;
  width: 95.5%;
  margin-top: 10px;
  padding: 10px 5px 10px 20px;
  text-align: left;
}
.peopleTitle {
  padding: 20px 0px 10px 0px;
}
.peopleTitle #headShot {
  position: absolute;
  left: 40px;
}
.peopleTitle div,
.people #name,
.people h3 {
  padding: 5px 40px 0px 0px;
  text-align: right;
}
.peopleTitle #workOnline {
  text-align: left;
  margin-top: 15px;
  padding: 10px 40px 0px 20px;
  border-top: dashed;
  border-top-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.3);
}
.people .el-dialog__body {
  padding: 0px;
}
.departmentTitle {
  text-align: left;
}
.department .el-dialog__body {
  padding: 0px;
}
#departmentPeople {
  text-align: left;
  padding: 5px 0px 5px 20px;
  margin-bottom: 10px;
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
}
.departmentProject {
  position: relative;
  text-align: left;
  margin: 10px 0px 10px 20px;
}
.department .item {
  padding: 10px 20px;
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
}
.datePicker {
  left: -5px;
}
.problem {
  text-align: left;
}
.problem .el-dialog__body {
  padding: 0px;
}
.problem .item {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 20px;
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
}
.project .el-dialog__footer {
  padding: 0px;
}
.projectButton1 {
  border-bottom: dashed;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  text-align: left;
  font-size: 14px;
  width: 100%;
  padding: 0px 0px 10px 20px;
}
.projectButton2 {
  text-align: left;
  font-size: 14px;
  width: 100%;
  padding: 10px 0px 10px 20px;
}
.el-icon-arrow-right {
  position: absolute;
  right: 10px;
}
.problem .problemDetail {
  font-size: 14px;
  font-weight: normal;
}
.problemGuiji {
  position: absolute;
  top: 20px;
  right: 50px;
}
.peopleGuiji {
  position: absolute;
  top: 160px;
  right: 30px;
}
.department .departmentGuiji {
  position: absolute;
  top: 20px;
  right: 50px;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
}
.create .el-dialog__body {
  padding: 0px 10px;
}
.el-dialog__headerbtn .el-dialog__close {
  color: black !important;
}
.projectImage {
  border: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.15);
  width: 140px;
  height: 140px;
  padding: 5px 10px;
}
.isFinished {
  background-image: url(../assets/完工.png);
  background-size: cover;
}
.upload {
  display: inline-block;
}
.projectCreate .el-input__inner {
  width: 165px;
  font-size: 15px;
}
#info {
  position: relative;
  left: 200px;
}
#info button {
  padding: 5px 10px;
}
.RightSide .el-dialog__wrapper {
  width: 625px;
}
.createBack {
  text-align: left;
}
.peopleBack {
  padding: 0px !important;
  position: absolute;
  left: 15px;
  top: 10px;
}
</style>