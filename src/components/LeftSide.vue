<template>
  <div class="LeftSide">
    <div id="online" @click="showPeople">
      <div style></div>
      <p>在线人员</p>
    </div>
    <div id="path" @click="showPathBox">
      <div></div>
      <p>作业点轨迹</p>
    </div>
    <div id="project" @click="projectHandler">
      <div></div>
      <p>项目管理</p>
    </div>
    <div id="member" @click="showMemberBox">
      <div></div>
      <p>人员管理</p>
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
    <el-dialog title="项目列表" :visible.sync="dialogProjectVisible" width="25%" id="projectDialog" :modal = "false">
      <el-card
        class="projectList"
        v-for="(project,index) in projectList"
        :key="index"
        :body-style="{ padding: '10px'}"
      >
        <div @click="showDetail(project.FGUID)">
          <h3>{{project["项目名称"] }}</h3>
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
    </el-dialog>
    <el-dialog
      :visible.sync="dialogDetailVisible"
      width="25%"
      id="dialogDetail"
      :show-close="false"
    >
      <div class="detail" >
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
          <li v-cloak>项目图片:
            <el-image :preview-src-list="srcList" style="width: 150px; height: 150px" lazy :src="url">
            <div slot="error"  >
              <i class="el-icon-picture">
              </i>
            </div>
          </el-image>
            </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog title="今日在线名单" :visible.sync="dialogPeopleVisible" width="20%" :modal = "false" id="peopleDialog">
      <el-card
        v-for="(people,index) in peopleList"
        :key="index"
        :body-style="{ padding: '10px'}"
      >
        <div>
          <h3>{{people.REALNAME }}</h3>
          <div>{{people.TIME}}</div>
          <!-- 只需要时分 -->
          <span>{{ people.COMPNAME +"--"}}</span>
          <span>{{ people.DEPTNAME}}</span>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";
export default {
  data() {
    return {
      path: false,
      member: false,
      time: null,
      dialogProjectVisible: false,
      dialogDetailVisible: false,
      dialogPeopleVisible: false,
      projectList: [],
      detailList: [],
      peopleList:[],
      name: "",
      url: "",
      srcList: []
    };
  },
  components: { DatePicker },
  methods: {
    /*  点击空白处隐藏空间的功能有待实现
    handleClose: function() {
      if(this.see){
        this.see = !this.see;
      }
    }, */
    showPathBox: function() {
      this.path = !this.path;
    },
    showMemberBox: function() {
      this.member = !this.member;
    },
    showPeople(){
      this.dialogPeopleVisible = true;
          this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=getUserLocate"
        )
        .then(response => {
          this.peopleList = response.data.result;
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
          console.log(response.data.result);
          /* 显示在底图上 */
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
          /* 显示在底图上 */
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
    showDetail(fguid) {
      this.dialogDetailVisible = true;
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getporjdetailbyid&fguid=" +
            fguid
        )
        .then(response => {
          this.detailList = response.data.source;
        });
        this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/DLService.ashx?action=getporjpicsbyid&fguid=" +
            fguid
        )
        .then(response => {
          let tmp = new Array;
          tmp = response.data.source.split(";").filter(function(e){return e!=""});
          for(let i = 0; i<tmp.length;i++){
            this.srcList.push(("http://58.213.48.104/JNSERVICE/" + tmp[i]).replace(/\\/g,"/"))
          }
          this.url = this.srcList[0];
        });
    },

  }
};
</script>
<style >
* {
  margin: 0px;
  padding: 0px;
}
.LeftSide {
  width: 30%;
  padding-top: 5px;
  position: absolute;
  top: 60px;
  left: 60px;
}
#online,
#path,
#project,
#member {
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
#online p,
#path p,
#project p,
#member p {
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
#peopleDialog .el-dialog__body {
  padding: 10px 15px;
}
#projectDialog .el-dialog__body {
  padding: 0px 10px;
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
</style>