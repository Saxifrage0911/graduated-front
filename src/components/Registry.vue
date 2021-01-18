<template>
  <div>
    <el-container>
      <el-aside width="600px">
        <div class="block">
          <el-carousel height="650px" indicator-position="outside">
            <el-carousel-item
              ><img id="carousel" src="../assets/plane1.jpg"
            /></el-carousel-item>
            <el-carousel-item
              ><img id="carousel" src="../assets/plane2.jpg"
            /></el-carousel-item>
            <el-carousel-item
              ><img id="carousel" src="../assets/plane3.jpg"
            /></el-carousel-item>
            <el-carousel-item
              ><img id="carousel" src="../assets/plane4.jpg"
            /></el-carousel-item>
          </el-carousel>
        </div>
      </el-aside>
      <el-main>
        <el-card id="rebox">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">用户注册</span>
          </div>
          <el-form ref="user" :model="user" :rules="rules">
            <el-form-item label="账号" prop="uAccount">
              <el-input v-model="user.uAccount"></el-input>
            </el-form-item>

            <el-form-item label="昵称" prop="uName">
              <el-input v-model="user.uName"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="tempPassword">
              <el-input
                show-password
                clearable
                v-model="user.tempPassword"
              ></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="uPassword">
              <el-input
                show-password
                clearable
                v-model="user.uPassword"
              ></el-input>
            </el-form-item>

            <el-form-item label="真实姓名" prop="uRealname">
              <el-input v-model="user.uRealname"></el-input>
            </el-form-item>

            <el-form-item label="身份证号" prop="uIdnum">
              <el-input v-model="user.uIdnum"></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-radio v-model="user.uSex" label="1">男</el-radio>
              <el-radio v-model="user.uSex" label="2">女</el-radio>
            </el-form-item>

            <el-form-item label="手机号码" prop="uPhone">
              <el-input v-model="user.uPhone"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="uEmail">
              <el-input v-model="user.uEmail"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-button
                  style="width: 70%"
                  type="primary"
                  @click="submitForReg('user')"
                  >注册</el-button
                >
              </el-col>
              <el-col :span="8">
                <el-button style="width: 70%" type="info" @click="toHome()"
                  >首页</el-button
                >
              </el-col>
              <el-col :span="8">
                <el-button style="width: 70%" type="success" @click="toLogin()"
                  >返回登录</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
    <!-- {{user}} -->
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import Util from "../util.js";
export default {
  name: "Regitry",
  data() {
    var validAccount = (rule, value, callback) => {
      if (value == null || value.trim() == "") {
        callback(new Error("请输入账号"));
      } else {
        var result = Util.accountIsExist(value);
        if (result) {
          callback(new Error("账号已存在"));
        } else callback();
      }
    };
    var validIdnum = (rule, value, callback) => {
      if (value == null || value.trim() === "") {
        callback(new Error("请输入身份证号"));
      } else {
        if (value.length != 15 && value.length != 18) {
          callback(new Error("身份证号格式非法"));
        }
        else{
            var result = Util.idnumIsExist(value);
            if(result){
                callback(new Error("身份证号已被注册"));
            }
            else callback();
        }
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.user.uPassword !== "") {
          this.$refs.user.validateField("uPassword");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.tempPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback();
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      user: {
        uAccount: null,
        uName: null,
        uPassword: null,
        uRealname: null,
        uIdnum: null,
        uPassword: null,
        tempPassword: null,
        uSex: null,
        uPhone: null,
        uEmail: null,
      },
      rules: {
        uAccount: [
          { required: true, validator: validAccount, trigger: "blur" },
        ],
        uName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        uRealname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        uIdnum: [{ required: true, validator: validIdnum, trigger: "blur" }],
        uEmail: [
          {
            type: "email",
            required: false,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        uPhone: [
          {
            validator: checkPhone,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        tempPassword: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        uPassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    alertHelper(msg,mType){
      this.$message({
        type: mType,
        message: msg
      });
    },
    toHome() {
      window.location.href = "/#/";
    },
    toLogin() {
      window.location.href = "/#/login";
    },
    submitForReg(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            headers: {
              token: localStorage.token,
            },
            url: process.env.VUE_APP_API_URL + "/registry",
            data: JSON.stringify(that.user),
            success: function (result) {
              if(result.code==200){
                that.alertHelper('注册成功，将自动跳转至登录页','success');
                that.$refs['user'].resetFields();
                setTimeout(function(){
                  window.location.href="/#/login";
                },2000);
              }
              else{
                that.alertHelper('发生异常：'+result.msg,'error');
              }
            },
            error: function () {
              that.$notify.error({
                title: "错误",
                message: "系统内部异常",
              });
            },
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style>
#carousel {
  width: auto;
  height: 100%;
}
#rebox {
  width: 520px;
  background-image:linear-gradient(#ffd1f7,#dcff9c);
  position: absolute;
  margin-left:5%;
}
.el-carousel__item {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 550px;
  margin: 0;
  width: 80%;
  left: -15%;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>