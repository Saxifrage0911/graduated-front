<template>
  <div>
    <el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item index="1" @click="toHome()">
    <i class="el-icon-s-home"></i>
    <span slot="title">首页</span>
  </el-menu-item>
  <el-menu-item index="2" @click="toHome()">
    <i class="el-icon-search"></i>
    <span slot="title">查询航班</span>
  </el-menu-item>
  <el-submenu index="3">
    <template slot="title">
      <i class="el-icon-star-on"></i>
      <span>我的订单</span>
    </template>
    <el-badge :value="12" class="item" type="primary">
    <el-menu-item index="2-1">已完成订单</el-menu-item>
    </el-badge>
    <el-badge :value="12" class="item">
    <el-menu-item index="2-2">未完成订单</el-menu-item>
    </el-badge>
  </el-submenu>
  <el-menu-item index="4" @click="toUpdate()">
    <i class="el-icon-s-custom"></i>
    <span slot="title">个人中心</span>
  </el-menu-item>
  <el-submenu v-if="isLogin" index="5">
    <template slot="title">
      <i class="el-icon-hot-water"></i>
      <span>当前用户:{{cur_account}}</span>
    </template>
    <el-menu-item index="5-1" @click="toLogout()">
      <i class="el-icon-switch-button"></i>
      <span slot>注销</span>
    </el-menu-item>
  </el-submenu>
  <el-menu-item v-if="isLogout" index="6" @click="toLogin()">
    <i class="el-icon-sugar"></i>
    <span slot>登录</span>
  </el-menu-item>
</el-menu>
  </div>
</template>

<style>
.userInfo{
  color:aliceblue;
  margin-right: 4%;
  margin-top: 2%;
  position:relative;
  display:block;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
.el-menu-demo{
  border-right-width: 0;
}

</style>

<script>
import $ from "jquery";
export default {
  name:"myMenu",  
  data() {
    return {
      activeIndex: '1',
      isLogout:true,
      isLogin:false,
      cur_account:null
    };
  },
  mounted:function(){
    if(localStorage.getItem("state")=="login"){
      this.isLogin = true;
      this.isLogout = false;
      this.cur_account = localStorage.account;
    }else{
      this.isLogin = false;
      this.isLogout = true;;
    }
  },
  methods: {
    toHome:function(){
      window.location.href="/#/search";
    },
    toSearch:function(){
      window.location.href="/#/search";
    },
    toUpdate:function(){
      window.location.href="/#/update";
    },
    toLogin:function(){
      window.location.href="/#/login";
    },
    toLogout:function(){
      localStorage.state="logout";
      var that = this;
      if(localStorage.token==null){
        this.$alert('用户信息不存在', '异常', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: `自动跳转至登录页`
            });
            setTimeout(function(){
              window.location.href="/#/login";
            },1500);
          }
        });
      }
      $.ajax({
            type: "GET",
            dataType: "json",
            headers:{
            'token':localStorage.token
            },
            url: process.env.VUE_APP_API_URL + "/logout",
            success:function(result){
              if(result.code!=200){
                that.$notify.error({
                title: "错误",
                message: "发生异常:"+result.msg,
                });
              }
              localStorage.token=null;
              localStorage.account=null;
              localStorage.userId=null;
              window.location.href="/#/login";
            },
            error:function(err){
              that.$notify.error({
                title: "错误",
                message: "发生异常:"+err,
              });
              setTimeout(function(){
                window.location.href="/#/login";
              },2000);
            }
      });
    }
  },
};
</script>