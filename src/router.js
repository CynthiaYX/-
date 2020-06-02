import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
import Home from "./components/Home.vue";
import ProjectManager from "./components/ProjectManager.vue";
import Login from "./components/Login.vue";

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
    {
        path:"/",
        component: Login
    },
    {
        path:"/Home",
        component: Home
    },
    {
        path:"/ProjectManager",
        component: ProjectManager
    },
    /* {
        path: "/about",
        component: about
    } */
]

var router =  new VueRouter({
    routes
})
export default router;