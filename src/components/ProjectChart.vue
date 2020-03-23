<template>
    <div class="Chart">
        <span></span>
        <h4>数据分析</h4>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
*{
    padding: 0px;
    margin: 0px;
}
.Chart{
    width: 24%;
    height: 350px;
    position: absolute;
    right: 30px;
    top: 235px;
    background-color: white;
    box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.15);
}
span{
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
h4{
    margin: 15px;
    position: absolute;
    left: 15px;
}
</style>