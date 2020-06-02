<template>
  <div class="Login">
    <div class="loginDialogue">
      <h1>登录</h1>
      <el-input clearable v-model="userName" class="input" placeholder="请输入用户名"></el-input>
      <el-input clearable show-password v-model="password" class="input" placeholder="请输入密码"></el-input>
      <el-button type="primary" class="loginButton" @click="login">登录</el-button>
    </div>
  </div>
</template>
<script>
import store from "../store.js";
import Vue from "vue";
export default {
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  methods: {
    login() {
      this.axios
        .get(
          "http://58.213.48.104/JNSERVICE/CoordConvertTask.ashx?action=UserLogin&username=" +
            this.userName +
            "&password=" +
            this.password
        )
        .then(response => {
          if (response.data.success) {
            Vue.set(store.state, "user", this.userName);
            this.$router.push('/Home')
          }
        });
    }
  }
};
</script>
<style scoped>
* {
  padding: 0px;
  margin: 0px;
}
.Login {
  height: 100%;
  background-color: linen;
}
.loginDialogue {
  position: fixed;
  left: 650px;
  top: 300px;
  background: rgba(255, 255, 255, 0.85);
  border: dashed;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 1px 2px 20px 5px rgba(0, 0, 0, 0.15);
}
h1 {
  margin-top: 20px;
}
.input {
  width: 80%;
  margin: 15px 20px;
}
.loginButton {
  padding: 15px 35px;
  margin-bottom: 20px;
  font-size: 16px;
}
</style>