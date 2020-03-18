<template>
  <div class="RightSide">
      <span><input class="searchbox" type="text" placeholder="输入地名"/></span>
      <button ></button>
      <ul>
        <li>
          <span class="redpin"></span>
          <p></p>
        </li>
      </ul>
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
ul{
  position:relative;
  left: 10px;
  width: 50px;
}
.redpin{
  display: block;
  width: 10px;
  height: 10px;
}

</style>