<template>
  <div class="RightSide">
      <span><input class="searchbox" type="text" placeholder="输入地名"/></span>
      <button ></button>
      <ul class="pulldown">
        <li>
          <span class="redpin"></span>
          <p>[JNGT]</p>
        </li>
      </ul>
      <div class="detail">
        <div class ="detailhead">
          <p>[JNGT]</p>
          <span></span>
          <a href="#">轨迹导出</a>
        </div>
        <ul>
          <li>案件号：</li>
          <li>委托合同号</li>
          <li>项目名称：</li>
          <li>委托单位：</li>
          <li>工程等级：</li>
          <li>细分类型：</li>
          <li>承接部门：</li>
          <li>生产部门：</li>
          <li>需求：</li>
          <li>联系人：</li>
          <li>项目地址：</li>
          <li>问题图片：</li>
        </ul>
      </div>
  </div>
</template>
<script>
export default {
  name: "RightSide"
};
</script>
<style scoped>
* {
  padding:0px;
  margin: 0px;
}
.RightSide {
    width: 40%;
    height: 100%;
    position:absolute;
    top:80px;
    right: 0px;
}
.searchbox{
  position:relative;
  height: 35px;
  width: 250px;
  left:10px;
  border: none;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  padding: 0px 10px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2px
}
button{
  position:relative;
  height: 35px;
  width: 50px;
  right:-10px;
  top: 13px;
  border: none;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 2px
}
.pulldown{
  /* display: none; */
  position:relative;
  left: 20.5%;
  width: 50%;
  list-style-type:none;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  padding: 15px 8px 5px 8px;
}
.pulldown li{
  border-bottom: dashed;
  border-bottom-color: rgba(0, 0, 0, 0.3);
  padding-bottom: 10px ;
}
.redpin{
  float: left;
  width: 25px;
  height: 20px;
  background-image: url(../assets/定位位置.png);
  background-repeat: no-repeat;
  background-position: center;
}
.pulldown p{
  margin-left: 25px;
  text-align: left;
}
.detail{
  position:relative;
  top: 3%;
  left: 20.5%;
  width: 53%;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.detailhead{
  padding: 5px 0px;
  background-color:  #3287fec2;
  border-radius: 2px;
  color: white;
}
.detailhead span{
  display: inline-block;
  position:relative;
  right: -35%;
  width: 10px;
  height: 10px;
  background-image: url(../assets/下载.png);
  background-repeat: no-repeat;
  background-position: center;
}
.detailhead a{
  font-size: 11px;
  position: relative;
  right: -37%;
}
.detail li{
   padding: 7px;
   margin: 0px 8px;
   font-size: 13px;
   list-style-type:none;
   text-align: left;
   border-bottom: dashed;
   border-bottom-color: rgba(0, 0, 0, 0.2);
}
</style>