<template>
  <div class="LeftSide">
    <div id="online" >
      <div style=""></div>
      <p>在线天数</p>
    </div>
    <div id="path" @click="showBox">
      <div></div>
      <p>作业点轨迹</p>
    </div>
    <div id="project" >
      <div></div>
      <p>项目管理</p>
    </div>
    <div id="member" >
      <div></div>
      <p>人员管理</p>
    </div>
    <div class="searchbox" v-if="see">
      <p>作业点轨迹查询</p>
      <div class="search">
        <input type="text" />
        <div>
          <button>查询</button>
          <button>导出shp</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      see: true
    };
  },
  methods: {
    showBox: function() {
      this.see = true;
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
#path,#project,#member {
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
  width: 50px;
  height: 50px;
  margin: 5px;
  font-size: 9px;
  background:white;
  
}
#online div{
  position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/天数.png);
  background-repeat:no-repeat;
  background-position:center;
  background-size: cover;
  left: 2.5px;
}
#path div{
   position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/轨迹.png);
  background-repeat:no-repeat;
  background-position:center;
  background-size: cover;
  left: 2.5px;
}
#project div{
   position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/项目管理.png);
  background-repeat:no-repeat;
  background-position:center;
  background-size: cover;
  left: 2.5px;
}
#member div{
 position: relative;
  width: 45px;
  height: 40px;
  background-image: url(../assets/人员.png);
  background-repeat:no-repeat;
  background-position:center;
  background-size: cover;
  left: 2.5px;
}
#online p,
#path p ,#project p,#member p{
  position: relative;
  bottom: 2px;
  
}
.searchbox {
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
  width: 200px;
  height: 150px;
  margin-left: 10px;
  padding-top: 5px;
  background: white;
}
.searchbox p {
  height: 20%;
}
.search {
  width: 100%;
  border-top: solid;
  border-top-color: rgba(0, 0, 0, 0.15);
  border-top-width: 1px;
}
input {
  height: 25px;
  margin-top: 20px;
}
button {
  width: 35%;
  background-color: rgba(0, 0, 0, 0.15);
  border: none;
  font-size: 14px;
  padding: 9px;
  margin: 10px;
  box-shadow: 1px 2px 10px  rgba(0, 0, 0, 0.15);
}
</style>