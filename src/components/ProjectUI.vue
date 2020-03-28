<template>
  <div class="UI">
    <ul>
      <li id="daishenhe">
        <h1>{{undo}}</h1>
        <span></span>
        <p>待审核任务</p>
        <el-progress  :stroke-width="7" :percentage="Math.round(undo/total*100)" :color=" colorundo "></el-progress>
      </li>
      <li id="daichuli">
        <h1>{{todo}}</h1>
        <span></span>
        <p>待处理任务</p>
        <el-progress  :stroke-width="7" :percentage="Math.round(todo/total*100)" :color=" colortodo "></el-progress>
      </li>
      <li id="yiwancheng">
        <h1>{{done}}</h1>
        <span></span>
        <p>已完成任务</p>
        <el-progress  :stroke-width="7" :percentage="Math.round(done/total*100)" :color=" colordone " ></el-progress>
      </li>
      <li id="yichang">
        <h1>{{bug}}</h1>
        <span></span>
        <p>异常任务</p>
        <el-progress  :stroke-width="7" :percentage="Math.round(bug/total*100)" :color=" colorbug "></el-progress>
      </li>
    </ul>
    <span class="ProjectButton">
      <button>任务创建</button>
      <button>任务审核</button>
    </span>
  </div>
</template>
<script>
export default {
  data(){
    return{
      colorundo: "lightgreen",
      colortodo:"lightblue",
      colordone:"pink",
      colorbug:"orange",
      total: 1,
      done: 0,
      bug: 0,
      reject: 0,
      undo:0,
      todo:0,
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
        this.undo = response.data.result.undolist.length;
        this.todo = this.total-this.bug-this.reject-this.done-this.undo;
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
  top: 12%;
  background-color: white;
  display: inline-block;
  list-style-type: none;
  width: 79%;
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
  margin: 20px 7px;
  background-position: center;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
ul span{
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
#daishenhe span{
  background-image: url(../assets/待审核.png);
}
#daichuli {
  background-image: url(../assets/2.png);
}
#daichuli span{
  background-image: url(../assets/待处理.png);
}
#yiwancheng {
  background-image: url(../assets/形状47副本2.png);
}
#yiwancheng span{
  background-image: url(../assets/已完成.png);
}
#yichang {
  background-image: url(../assets/形状47副本3.png);
}
#yichang span{
  background-image: url(../assets/异常任务.png);
}
h1{
  display: inline-block;
  margin-top: 15px;
  position: relative;
  left: -60px;
  text-align:left
}
p{
  margin-top: 5px;
  position: relative;
  left: -55px;
}
.ProjectButton {
  display: inline-block;
  width: 15%;
  height: 110px;
  position: absolute;
  right: 30px;
  top: 12%;
  background-color: white;
  padding: 20px 0px;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
}
button {
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