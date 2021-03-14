<template>
  <div class="login" align="center">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size:18px">欢迎登录航班机票系统</span>
        <a href="/#/registry" class="registry">前往注册</a>
      </div>
      <el-form ref="userdto" :rules="rules" :model="userdto">
          <el-form-item label="账号" prop="account">
              <el-input v-model="userdto.account" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="userdto.password" clearable show-password></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-col :span="10">
              <el-input v-model="userdto.code" clearable></el-input>
            </el-col>
              <img id="verification" :src="kaptchaUrl"
                   style="cursor: pointer" @click="refresh()" title="看不清？换一张"/>
          </el-form-item>
      </el-form>
      <el-button type="primary" round style="width:30%;" @click="toLogin('userdto')">登录</el-button>
      <el-button type="info" round style="width:30%;" @click="toHome()">返回首页</el-button>
    </el-card>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "login",
  data() {
    return {
        userdto:{
            account:null,
            password:null,
            code:null
        },
        rules:{
            account:[{required: true, message: "请输入名称", trigger: "blur" }],
            password:[{required: true, message: "请输入密码", trigger: "blur" }],
            code:[{required: true, message: "请输入验证码", trigger: "blur" }]
        },
        kaptchaUrl:"https://localhost:8088/defaultKaptcha?"
    };
  },
  mounted:function(){
      var that = this;
      var addrstr = location.href;
      var permit = addrstr.substring(addrstr.lastIndexOf("?") + 8, addrstr.length);
      if(permit=='false'){
          that.$notify.error({
                title: "错误",
                message: "没有权限，请先登录"
              });
      }
  },
  methods:{
      toLogin:function(formName){
          var that = this;
          this.$refs[formName].validate((valid) => {
        if (valid) {
          $.ajax({
            type: "POST",
            dataType: "json",
            url: process.env.VUE_APP_API_URL + "/login",
            contentType: 'application/json',
            data: JSON.stringify(that.userdto),
            success: function (result) {
              if(result.code==200){
                  var token = result.data.substring(0,result.data.indexOf("?"));
                  localStorage.token = token;
                  var id = result.data.substring(result.data.indexOf("?")+1);
                  localStorage.userId = id;
                  localStorage.account=that.userdto.account;
                  localStorage.state="login";
                  console.log(localStorage.token);
                  console.log(localStorage.userId);
                  window.location.href="/#/search";
              }
              else if(result.code==107){
                that.loginError("用户名或密码错误！");
              }
              else if(result.code==112){
                that.loginError("验证码错误！");
              }
            },
            error: function (error) {
              that.$notify.error({
                title: "错误",
                message: "发生异常",
              });
            },
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      },

      loginError:function(val){
          this.$message({
          message: val,
          type: 'error'
        });
      },

      toHome:function(){
        window.location.href="/#/search";
      },

      refresh:function(){
        this.kaptchaUrl = "https://localhost:8088/defaultKaptcha?random="+Math.random();
      }


  }
};
</script>

<style>
.login{
  background-image: url("../assets/plane5.jpg");
  height: 682px;
  background-repeat:no-repeat;
  background-size:100% 100%;
}
.text {
  font-size: 30px;
}
.registry{
  color: rgb(55, 216, 109);
  margin-left: 5%;
  font-size: 15px;
  position: absolute;
}
.registry:hover{
  color: red;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>