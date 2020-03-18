<template>
  <div class="LeftSide">
    <div id="online">
      <div style></div>
      <p>在线天数</p>
    </div>
    <div id="path" @click="showBox" >
      <div></div>
      <p>作业点轨迹</p>
    </div>
    <div id="project">
      <div></div>
      <p>项目管理</p>
    </div>
    <div id="member">
      <div></div>
      <p>人员管理</p>
    </div>
    <div class="searchbox" v-if="see" >
      <p>作业点轨迹查询</p>
      <div class="search">
        <date-picker v-model="time" valuetype="format" placeholder="选择日期"></date-picker>
        <div>
          <button>查询</button>
          <button>导出shp</button>
        </div>
      </div>
    </div>
    <div class="memberbox" >
      <p>人员管理</p>
      <div id="membersearch">
        <input type="text" placeholder="输入姓名"><button>查询</button>
      </div>
      <ul class="card">
        <li>
            <span>仇宇轩</span>
            <button>详情</button>
            <ul class="detail">
              <li>部门：</li>
              <li>进行中项目：</li>
              <li>联系电话：</li>
            </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import 'vue2-datepicker/locale/zh-cn';
export default {
  data() {
    return {
      see: false,
      time: null,
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
    showBox: function() {
      this.see = !this.see;
    }
  }
};
</script>
<style scoped>
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
.search {
  width: 100%;
  border-top: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-top-width: 1px;
  padding-top:15px;
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
.memberbox{
  height: 200px;
  width: 75%;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.memberbox p{
  position: relative;
  top: 5px;
}
#membersearch{
  border-top: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-top-width: 1px;
  padding-top: 10px;
  margin-top: 10px;
}
.memberbox input{
  position:absolute;
  left: 20px;
  height: 24px;
  border: solid rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  padding-left: 10px;
}
#membersearch button{
  position: relative;;
  left: 90px;
  background-color: #3286fec2;
  border: none;
  font-size: 12px;
  color: white;
  padding: 5px 15px;
  
  border-radius: 3px;
}
.card{
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  width: 90%;
  left: 5%;
  margin-bottom: 5px;
  border-radius: 2px;
}
.card li{
  list-style-type:none;
  margin: 10px 0px 5px 0px;
  background:#d4e7fb;
  text-align: left;
  border-radius: 2px;
}
.card span{
  position:relative;
  left: 20px;
  font-size: 18px;
}
.card button{
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
.detail{
  padding-bottom: 5px;
}
.detail li{
  margin: 3px 20px;
  background: transparent;

}
</style>