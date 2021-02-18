<template>
  <div>
    <el-container>
      <el-header>
        <myMenu ref="myMenu"></myMenu>
        <!-- {{user}} -->
      </el-header>
      <el-aside>
        <div class="passenger">
          <h2>乘客数据</h2>
          <el-card>
            <el-form ref="newPass" :model="newPass" :rules="passRule">
              <el-form-item label="真实姓名" prop="pRealname">
                <el-input v-model="newPass.pRealname"></el-input>
              </el-form-item>

              <el-form-item label="身份证号" prop="pIdnum">
                <el-input v-model="newPass.pIdnum"></el-input>
              </el-form-item>

              <el-button type="primary" v-if="isAdd" @click="addPass('newPass')">添加</el-button>
              <el-button type="success" v-if="isUp" @click="upPass('newPass')">更改</el-button>
              <el-button type="warning" v-if="isUp" @click="toAdd()">返回添加</el-button>
            </el-form>
          </el-card>
          <br />
          <el-table :data="passengers" stripe border height="320px" id="passTable">
            <el-table-column prop="pIdnum" label="身份证号" width="180">
            </el-table-column>

            <el-table-column prop="pRealname" label="真实姓名" width="180">
            </el-table-column>

            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">

                <el-button size="medium" type="primary" @click="toUpdate(scope.row)" plain>编辑</el-button>

                <el-popconfirm title="确定删除吗？" @confirm="delPass(scope.row.passId)">
                <el-button slot="reference" size="medium" type="danger" plain>删除</el-button>
                </el-popconfirm>

              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-aside>
      <el-main>
        <el-card class="upCard">
          <el-form ref="user" :model="user" :rules="rules">
            <el-form-item label="昵称" prop="uName">
              <el-input v-model="user.uName"></el-input>
            </el-form-item>

            <el-form-item label="真实姓名">
              <el-input disabled v-model="user.uRealname"></el-input>
            </el-form-item>

            <el-form-item label="身份证号">
              <el-input disabled v-model="user.uIdnum"></el-input>
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
                <el-button style="width: 70%" type="primary" @click="submitForUp('user')">保存更改</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import Util from "../util.js";
import myMenu from "./Menu";
export default {
  name: "Update",
  components: { myMenu: myMenu },
  data() {
    var validIdnum = (rule, value, callback) => {
      if (value == null || value.trim() === "") {
        callback(new Error("请输入身份证号"));
      } else {
        if (value.length != 15 && value.length != 18) {
          callback(new Error("身份证号格式非法"));
        } else {
          callback();
        }
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback();
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };

    return {
      user: {
        uId: null,
        uName: null,
        uRealname: null,
        uIdnum: null,
        uSex: null,
        uPassword: null,
        uPhone: null,
        uEmail: null,
        uAccount: null,
      },
      rules: {
        uName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
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
      },
      newPass: {
        pIdnum: null,
        pRealname: null,
        passId:null,
        uId: null,
      },
      passRule: {
        pIdnum: [{ required: true, validator: validIdnum, trigger: "blur" }],
        pRealname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
      },
      passengers: [],
      idnums:[],
      cur_idnum:null,
      isAdd: true,
      isUp: false,
    };
  },

  mounted: function () {
    if (localStorage.account == null) {
      this.alertHelper("登录信息失效，请重新登录", "error");
      setTimeout(function () {
        window.location.href = "/#/login";
      }, 2000);
    } else {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
          account: localStorage.account,
        },
        url: process.env.VUE_APP_API_URL + "/getUserByAccount",
        success: function (result) {
          if (result.code == 200) {
            that.user.uName = result.data.uName;
            that.user.uId = result.data.uId;
            that.user.uRealname = result.data.uRealname;
            that.user.uIdnum = result.data.uIdnum;
            that.user.uPhone = result.data.uPhone;
            that.user.uEmail = result.data.uEmail;
            that.user.uAccount = result.data.uAccount;
            that.user.uPassword = result.data.uPassword;
            that.idnum = result.data.uIdnum;
            that.user.uSex = "" + result.data.uSex;
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常", "error");
        },
      });
    }
    this.initPassenger();
  },

  methods: {
    alertHelper(msg, mType) {
      this.$message({
        type: mType,
        message: msg,
      });
    },

    initPassenger() {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:
          process.env.VUE_APP_API_URL +
          "/getAllPassByAccount?account=" +
          localStorage.account,
        success: function (result) {
          if (result.code == 200) {
            that.passengers = [];
            that.idnums = [];
            for (var i = 0; i < result.data.length; i++) {
              that.passengers.push(result.data[i]);
              that.idnums.push(result.data[i].pIdnum);
            }
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常", "error");
        },
      });
    },

    submitForUp: function (formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $.ajax({
            type: "PUT",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            headers: {
              token: localStorage.token,
            },
            url: process.env.VUE_APP_API_URL + "/updateUser",
            data: JSON.stringify(that.user),
            success: function (result) {
              if (result.code == 200) {
                that.alertHelper("修改成功", "success");
              } else {
                that.alertHelper("发生异常：" + result.msg, "error");
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

    addPass: function (formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (localStorage.userId != null) {
            that.newPass.uId = localStorage.userId;
          } else {
            that.alertHelper("登录信息失效，请重新登录！", "error");
            setTimeout(function () {
              window.location.href = "/#/login";
            }, 2000);
          }
          if (that.idnums.indexOf(that.newPass.pIdnum) != -1) {
            that.alertHelper("身份证号已存在您的乘客列表！", "error");
          } else {
            $.ajax({
              type: "POST",
              dataType: "json",
              contentType: "application/json;charset=UTF-8",
              headers: {
                token: localStorage.token,
              },
              url: process.env.VUE_APP_API_URL + "/addPassenger",
              data: JSON.stringify(that.newPass),
              success: function (result) {
                if (result.code == 200) {
                  that.alertHelper("添加乘客成功！", "success");
                  that.$refs[formName].resetFields();
                  that.initPassenger();
                } else {
                  that.alertHelper(result.msg, "error");
                }
              },
              error: function (err) {
                that.alertHelper("系统内部异常", "error");
              },
            });
          }
        } else {
          console.log("error submit!");
        }
      });
    },

    delPass:function(passId){
      var that = this;
      $.ajax({
        type:"DELETE",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        headers: {
          token: localStorage.token,
        },
        url: process.env.VUE_APP_API_URL + "/delPassenger?id="+passId,
        success:function(result){
          if(result.code==200){
            that.alertHelper("删除成功","success");
            that.initPassenger();
          }
          else{
            that.alertHelper(result.msg,"error");
          }
        },
        error:function(err){
          that.alertHelper("系统内部异常","error");
        }
      });
    },

    upPass:function(formName){
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (localStorage.userId != null) {
            that.newPass.uId = localStorage.userId;
          } else {
            that.alertHelper("登录信息失效，请重新登录！", "error");
            setTimeout(function () {
              window.location.href = "/#/login";
            }, 2000);
          }
          if (that.cur_idnum!=that.newPass.pIdnum&&that.idnums.indexOf(that.newPass.pIdnum) != -1) {
            that.alertHelper("身份证号已存在您的乘客列表！", "error");
          } else {
            $.ajax({
              type: "PUT",
              dataType: "json",
              contentType: "application/json;charset=UTF-8",
              headers: {
                token: localStorage.token,
              },
              url: process.env.VUE_APP_API_URL + "/updatePassenger",
              data: JSON.stringify(that.newPass),
              success: function (result) {
                if (result.code == 200) {
                  that.alertHelper("更新乘客成功！", "success");
                  that.$refs[formName].resetFields();
                  that.initPassenger();
                } else {
                  that.alertHelper(result.msg, "error");
                }
              },
              error: function (err) {
                that.alertHelper("系统内部异常", "error");
              },
            });
          }
        } else {
          console.log("error submit!");
        }
      });
    },

    toUpdate:function(pass){
      this.newPass.pRealname = pass.pRealname;
      this.newPass.pIdnum = pass.pIdnum;
      this.cur_idnum = pass.pIdnum;
      this.newPass.uId = pass.uId;
      this.newPass.passId = pass.passId;
      this.isAdd = false;
      this.isUp = true;
    },

    toAdd:function(formName){
      this.isAdd = true;
      this.isUp = false;
      this.newPass.pRealname = null;
      this.newPass.pIdnum = null;
      this.cur_id = null;
      this.newPass.uId = null;
      this.newPass.passId = null;
      this.$refs[formName].resetFields();
    }
  },
};
</script>

<style>
.upCard {
  width: 530px;
  position: absolute;
  margin-left: 53%;
  background-image: linear-gradient(#abffc7, #b6d3ff);
}
.passenger {
  position: absolute;
  margin-top: 0%;
  margin-left: 2%;
  width:40%
}
#passTable{
  width: 100%;
}
</style>