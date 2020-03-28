<template>
  <div class="Chart">
    <span></span>
    <h4>数据分析</h4>
    <v-chart :options="pie" />
    <v-chart :options="line" />
    
  </div>
</template>
<script>
import "echarts/lib/chart/pie";
import "echarts/lib/chart/line";
import "echarts/lib/component/polar";
export default {
  data() {
    return {
      total: 1,
      done: 0,
      bug: 0,
      reject: 0,
      undo: 0,
      todo: 0,
      pie: {
        /*无法实现标签功能，原因不明
          tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        }, */
        dataset: {
          source: []
        },
        series: [
          {
            type: "pie",
            radius: "45%",
            selectedMode: "single"
          }
        ]
      },
      line:{
          
      }
    };
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
        this.todo = this.total - this.bug - this.reject - this.done - this.undo;
        this.pie.dataset.source = [
          { value: this.todo, name: "待处理" },
          { value: this.bug, name: "异常" },
          { value: this.done, name: "已完成" },
          { value: this.undo, name: "待审核" }
        ];
        console.log(this.pie);
      });
  }
};
</script>
<style scoped>
* {
  padding: 0px;
  margin: 0px;
}
.Chart {
  width: 24%;
  height: 375px;
  position: absolute;
  right: 30px;
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
.echarts {
  position: relative;
  width: 100%;
  height: 60%;
}
</style>