<template>
  <div class="Table">
    <span></span>
    <h4>任务列表</h4>
    <input type="text" placeholder="搜索" />
    <table>
      <thead>
        <tr>
          <th>序号</th>
          <th>任务名称</th>
          <th>提交人</th>
          <th>提交时间</th>
          <th>任务状态</th>
          <th>下载结果</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>名称</td>
          <td>仇宇轩</td>
          <td>2020/03/23</td>
          <td>待审核</td>
          <td>
            <div></div>
          </td>
          <td>无</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
* {
  padding: 0px;
  margin: 0px;
}
.Table {
  display: inline-block;
  width: 70%;
  height: 350px;
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
table {
  position: absolute;
  top: 55px;
  left: 20px;
  border-collapse: collapse;
  width: 95%;
  color: rgba(0, 0, 0,0.65);
}
th,
td {
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 5px 10px;
}
td div {
  position: relative;
  left: 40%;
  height: 20px;
  width: 20px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(../assets/下载蓝.png);
}
input {
  position: absolute;
  right: 10px;
  top: 15px;
  height: 5px;
  padding: 10px;
  border-color: rgba(0, 0, 0, 0.15);
}
</style>