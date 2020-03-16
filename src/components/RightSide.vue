<template>
  <div class="RightSide">
    <div id="left-panel" class style="height: 507px;">
      <div id="searchbox" class="clearfix">
        <div id="searchbox-container">
          <div id="sole-searchbox-content" class="searchbox-content" style="display: block;">
            <input
              id="sole-input"
              class="searchbox-content-common"
              type="text"
              name="word"
              autocomplete="off"
              maxlength="256"
              placeholder="输入内容"
              value
            />
            <!-- 清空按钮的显示问题 -->
            <!-- <div class="input-clear" title="清空" style="display: none;"></div> -->
          </div>
        </div>
        <button id="search-button" data-title="搜索" data-tooltip="2"></button>
        <!-- 搜索选项框 -->
        <!--         
            <div id="toast-wrapper">
          <div id="toast">
            <img class="info-tip-img" src="/wolfman/static/common/images/transparent.gif" alt />
            <span class="info-tip-text"></span>
          </div>
        </div>-->
      </div>
      <!-- 下拉框 -->
      <!--       <ul id="cards-level0" class="cardlist"></ul>
      <ul id="cards-level1" class="cardlist"></ul>
      <ul id="cards-level2" class="cardlist"></ul>-->
    </div>
  </div>
</template>
<script>
export default {
  name: "RightSide"
};
</script>
<style scoped>
.RightSide {
    width: 100%;
    height: 100%;
    position:absolute;
    top:60px;
   
}
#left-panel {
  position: absolute;
  top: 10px;
  right: 20px;
  overflow: hidden;
  pointer-events: none;
}
#searchbox {
  border-radius: 2px;
  width: 425px;
  position: relative;
  z-index: 5;
}
#searchbox #searchbox-container {
  position: relative;
  z-index: 2;
  pointer-events: auto;
  width: 368px;
  float: left;
  box-sizing: border-box;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
}
#sole-searchbox-content {
  position: relative;
}
.searchbox-content {
  width: 368px;
  border-radius: 2px 0 0 2px;
  background: #fff;
}
#sole-searchbox-content.is-complete #sole-input {
  border-right: 10px solid transparent;
}
#sole-searchbox-content #sole-input {
  box-sizing: border-box;
  border: 0;
  padding: 9px 0;
  border-left: 10px solid transparent;
  border-right: 27px solid transparent;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 2px 0 0 2px;
}
#sole-searchbox-content .input-clear {
  right: 500px;
}
.searchbox-content .input-clear {
  cursor: pointer;
  position: absolute;
  width: 27px;
  height: 38px;
  top: 0;
  background: url(../assets/button.png) no-repeat 0 -114px #fff;
  display: none;
}

#sole-searchbox-content {
  position: relative;
}
.searchbox-content {
  width: 368px;
  border-radius: 2px 0 0 2px;
  background: #fff;
}
#searchbox #search-button {
  pointer-events: auto;
  background: url(//webmap1.bdimg.com/wolfman/static/common/images/new/searchbox_5c0d97d.png)
    no-repeat 0 -76px #3385ff;
  width: 57px;
  height: 38px;
  float: left;
  border: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 0 2px 2px 0;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
}
input,
button,
select,
textarea {
  outline: 0;
  font-family: inherit;
}
#toast-wrapper {
  pointer-events: auto;
  visibility: hidden;
  position: absolute;
  width: 368px;
  height: 35px;
  left: 0;
  bottom: -35px;
  z-index: 1;
  -webkit-transition: visibility 0.5s;
  transition: visibility 0.5s;
  overflow: hidden;
}
#toast {
  box-sizing: border-box;
  width: 100%;
  line-height: 33px;
  height: 35px;
  text-align: center;
  background: #ffffdf;
  border: 1px solid #f4f4d3;
  color: #666;
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
  -webkit-transform: translate3d(0, -100%, 0);
  transform: translate3d(0, -100%, 0);
}
#toast .info-tip-img {
  background: url(//webmap0.bdimg.com/wolfman/static/common/images/fav/tip_1674a4b.png)
    0 0 no-repeat;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 8px;
}
#toast .info-tip-text {
  vertical-align: -2px;
}
</style>