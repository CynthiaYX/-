<template>
  <div class="UI">
    <ul>
      <li id="daishenhe">
        <h1>{{undo}}</h1>
        <span></span>
        <p>待审核任务</p>
        <el-progress
          :stroke-width="7"
          :percentage="Math.round(undo/total*100)"
          :color=" colorundo "
        ></el-progress>
      </li>
      <li id="daichuli">
        <h1>{{todo}}</h1>
        <span></span>
        <p>待处理任务</p>
        <el-progress
          :stroke-width="7"
          :percentage="Math.round(todo/total*100)"
          :color=" colortodo "
        ></el-progress>
      </li>
      <li id="yiwancheng">
        <h1>{{done}}</h1>
        <span></span>
        <p>已完成任务</p>
        <el-progress
          :stroke-width="7"
          :percentage="Math.round(done/total*100)"
          :color=" colordone "
        ></el-progress>
      </li>
      <li id="yichang">
        <h1>{{bug}}</h1>
        <span></span>
        <p>异常任务</p>
        <el-progress :stroke-width="7" :percentage="Math.round(bug/total*100)" :color=" colorbug "></el-progress>
      </li>
    </ul>
    <span class="ProjectsButton">
      <button class="projectButton" @click="dialogFormVisible= true">任务创建</button>
      <button class="projectButton" @click="dialogTableVisible= true">任务审核</button>
    </span>
    <el-dialog title="创建任务" :visible.sync="dialogFormVisible" width="550px" center>
      <el-form :model="form">
        <el-form-item label="任务名称" >
          <el-input placeholder="需包含案件号、委托合同号或管理单元编号" clearable style="width: 73%" v-model="projectName"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" >
          <el-radio-group v-model="type">
            <el-radio-button label="CCT">归集数据</el-radio-button>
            <el-radio-button label="TSF">导线计算数据</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-upload
          drag
          action="http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=FileUpload&userid=zs001"
          multiple
          style="text-align: center;"
          :on-change="handleChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" >提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="待审核任务" :visible.sync="dialogTableVisible" width="800px">
      <el-table
        :data="undoProject"
        stripe
        height="200px"
        highlight-current-row="true"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45px" align="center"></el-table-column>
        <el-table-column prop="TASKNAME" label="任务名称" align="center"></el-table-column>
        <el-table-column prop="REALNAME" label="提交人" align="center"></el-table-column>
        <el-table-column prop="DEPTNAME" label="提交部门" align="center"></el-table-column>
        <el-table-column prop="SUBMIT_TIME" label="提交时间" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refuse">拒绝</el-button>
        <el-button type="primary" @click="pass">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      colorundo: "lightgreen",
      colortodo: "lightblue",
      colordone: "pink",
      colorbug: "orange",
      total: 1,
      done: 0,
      bug: 0,
      reject: 0,
      undo: 0,
      todo: 0,
      undoProject: [],
      multipleSelection: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      projectName: "",
      type: "",
      fileList : []
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChange(file,fileList){
      for(let i = 0;i<fileList.length;i++){
        if(!this.fileList.includes(fileList[i].name))
          this.fileList.push(fileList[i].name);
      }/* 文件上传功能存在问题 */
      console.log(this.fileList);
    },
    pass() {
      this.preaxios();
      /* post传参的方式过于愚蠢 */
      this.axios
        .post(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=CheckTask&userid=zs001&taskids=" +
            this.multipleSelection[0]
        )
        this.dialogTableVisible = false;
        /* .then(response => {
          
        }); */
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=GetTaskList&userid=zs001"
        )
        .then(response => {
          this.undoProject = response.data.result.undolist;
          this.undo = response.data.result.undolist.length;
        });
    },
    refuse() {
      this.preaxios();
      /* post传参的方式过于愚蠢 */
      this.axios
        .post(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=refuseTask&userid=zs001&taskids=" +
            this.multipleSelection[0]
        )
         this.dialogTableVisible = false;
        /* .then(response => {
         
        }); */
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=GetTaskList&userid=zs001"
        )
        .then(response => {
          this.undoProject = response.data.result.undolist;
          this.undo = response.data.result.undolist.length;
        });
    },
    submit(){
      if(this.type==="CCT"){
        for(let i =0; i< this.projectName.length;i++){
          this.axios
        .post(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=TaskSubmit&userid=zs001&type=CCT&taskname=" +
            this.projectName + "&file=" + this.projectName[i]
        )
        this.dialogFormVisible = false;
        /* .then(response => {
        }) */
        }
        
      }else{
        this.axios
        .post(
          /* TSF格式 */
          /* "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=TaskSubmit&userid=zs001&type=CCT&taskname=" +
            this.projectName + "&file=" + this.projectName */
        )
        /* .then(response => {
          this.dialogFormVisible = false;
        }) */;
      }
      
    },
    preaxios() {
      let tmp = "";
      for (let i = 0; i < this.multipleSelection.length; i++) {
        tmp += "'" + this.multipleSelection[i].FGUID + "',";
      }

      this.multipleSelection[0] = tmp.substring(0, tmp.length - 1);
    }
  },
  mounted() {
    this.axios
      .get(
        "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=GetTaskList&userid=zs001"
      )
      .then(response => {
        this.total = response.data.result.tasklist.length;
        this.bug = Number(response.data.result.tjlist[0]["异常"]);
        this.reject = Number(response.data.result.tjlist[0]["拒绝"]);
        this.done = Number(response.data.result.tjlist[0]["已完成"]);
        this.undoProject = response.data.result.undolist;
        this.undo = response.data.result.undolist.length;
        this.todo = this.total - this.bug - this.reject - this.done - this.undo;
      });
  }
};
</script>
<style scoped>
* {
  padding: 0px;
  margin: 0px;
}
.UI {
  width: 100%;
  height: auto;
}
ul {
  position: absolute;
  left: 30px;
  top: 100px;
  background-color: white;
  display: inline-block;
  list-style-type: none;
  width: 81%;
  height: 150px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  color: white;
}
li {
  display: inline-block;
  position: relative;
  left: 0px;
  width: 23%;
  height: 75%;
  margin: 20px 10px;
  background-position: center;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
ul span {
  display: inline-block;
  width: 25px;
  height: 25px;
  position: absolute;
  top: 20px;
  right: 10px;
  background-position: center;
  background-size: contain;
}
#daishenhe {
  background-image: url(../assets/1.png);
}
#daishenhe span {
  background-image: url(../assets/待审核.png);
}
#daichuli {
  background-image: url(../assets/2.png);
}
#daichuli span {
  background-image: url(../assets/待处理.png);
}
#yiwancheng {
  background-image: url(../assets/形状47副本2.png);
}
#yiwancheng span {
  background-image: url(../assets/已完成.png);
}
#yichang {
  background-image: url(../assets/形状47副本3.png);
}
#yichang span {
  background-image: url(../assets/异常任务.png);
}
h1 {
  display: inline-block;
  margin-top: 15px;
  position: relative;
  left: -110px;
  text-align: left;
}
p {
  margin-top: 5px;
  position: relative;
  left: -100px;
}
.ProjectsButton {
  display: inline-block;
  width: 15%;
  height: 110px;
  position: absolute;
  right: 30px;
  top: 100px;
  background-color: white;
  padding: 20px 0px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
}
.projectButton {
  height: 40px;
  width: 65%;
  background-color: rgba(35, 125, 255, 0.9);
  border: none;
  font-size: 13px;
  color: white;
  margin-top: 10px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
}
</style>