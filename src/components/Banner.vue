<template>
  <div class="Banner">
    <div id="header">
      <div id="logo">
        <a href="#"><!-- <img src="../assets/logo.jpg" alt=""> --></a>
      </div>
      <ul id="nav">
        <li>
          <div>
          </div>
          <a href="src\components\ProjectManager.vue" class="task">任务管理</a>
        </li>
        <li>
          <a href="#" class="supervise">作业监督</a>
        </li>
        <li>
          <a href="#" class="collect">多源采集</a>
        </li>
        <li>
          <a href="#" target="_blank" class="quit"></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "Banner"
};
</script>
<style scoped>
*{
    padding: 0px;
    margin: 0px;
}
#header {
  position: fixed;
  width: 100%;
  top: 0;
  background-color: rgb(53, 74, 95);
  height: 40px;
  padding: 10px 15px;
  z-index: 20;
}
#logo {
  width: 380px;
  height: 100%;
  background-image: url("../assets/logo.jpg");
  background-size: auto 100%;
}
.Banner #nav {
  position: fixed;
}
#nav {
  list-style-type: none;
  position: absolute;
  right: 200px;
  top: 10px;
  height: 40px;
  line-height: 40px;
}
#nav li {
  display: inline-block;
  position: relative;
  margin: 0 2em;
}
a {
  text-decoration: none;
  color: #ffffff;
}
</style>