import Vue from "vue";
import Vuex from "vuex";

//挂载Vuex
Vue.use(Vuex);


//创建VueX对象
const store = new Vuex.Store({
    state:{
        //存放的键值对就是所要管理的状态
         point : {
            type: "",
            longitude: 0,
            latitude: 0
          },
          geo:'',
          travel:[],
    },
    mutations:{
        setPoint(state,para){
            state.point.type = para.para.type;
            state.point.longitude = para.para.longitude;
            state.point.latitude  = para.para.latitude;
        },
        setGeo(state,para){
            state.geo = para;
        },
        timeTravel(state,para){
            state.travel.push(para);
        },
        clearTravel(state){
            state.travel = [];
        }

    }
});

export default store;