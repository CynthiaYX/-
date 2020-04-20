<template>
  <div class="Table">
    <span></span>
    <h4>任务列表</h4>
    <input type="text" placeholder="搜索" @keyup.enter="searchHandler" v-model="keyWord"/>
    <div class="elementTable">
      <el-table
        :data="tasklist.slice((currentPage-1)*10,currentPage*10)"
        stripe
        height="285px"
        highlight-current-row=true
        border = true
        :row-style="{height:'10px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%"
        lazy
      >
        <el-table-column prop="序号" label="序号" width = "50px" align="center"></el-table-column>
        <el-table-column prop="任务名称" label="任务名称" width = "200px" align="center"></el-table-column>
        <el-table-column prop="提交人" label="提交人"  width = "65px" align="center"></el-table-column>
        <el-table-column prop="提交时间" label="提交时间" width = "85px" align="center"></el-table-column>
        <el-table-column prop="任务状态" label="任务状态" width = "80px" align="center"></el-table-column>
        <!-- todo
        将下载结果的字符串变为超链接，并增加下载按钮 -->
        <el-table-column prop="下载结果" label="下载结果" width = "80px" align="center"></el-table-column>
        <el-table-column prop="备注" label="备注" show-overflow-tooltip=true align="center"></el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="tasklist.length"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tasklist: [],
      currentPage: 1,
      keyWord:"",
    };
  },
  methods:{
    searchHandler:function() {
      this.tasklist = this.tasklist.filter(
        /* includes无法实现完全的模糊查询，如需要使用indexof */
        tasklists => Object.values(tasklists).includes(this.keyWord)
      )
      console.log(this.keyWord);
    },
  },
  mounted() {
    this.axios
      .get(
        "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=GetTaskList&userid=zs001"
      )
      .then(response => {
        this.tasklist = response.data.result.tasklist;
      });
      
  }
};
</script>
<style scoped>
* {
  padding: 0px;
  margin: 0px;
}
.Table {
  display: inline-block;
  width: 70%;
  height: 375px;
  position: absolute;
  left: 30px;
  top: 235px;
  background-color: white;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
}
span {
  display: inline-block;
  width: 5px;
  height: 23px;
  position: absolute;
  top: 15px;
  left: 15px;
  background-position: center;
  background-size: contain;
  background-image: url(../assets/矩形14拷贝.png);
}
h4 {
  margin: 15px;
  position: absolute;
  left: 15px;
}
input {
  position: absolute;
  right: 19px;
  top: 15px;
  height: 5px;
  padding: 10px;
  border-color: rgba(0, 0, 0, 0.15);
}
.elementTable{
  position: absolute;
  width: 95%;
  bottom: 5px;
  left: 25px;
}
/* td div {
  position: relative;
  left: 40%;
  height: 20px;
  width: 20px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(../assets/下载蓝.png);
} */
</style>