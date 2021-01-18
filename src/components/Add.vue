<template>
  <div id="app">
    <el-container>
      <el-aside width="170px">
      <myMenu ref="myMenu"></myMenu>
      </el-aside>
      <el-main>
    <h1 align="left" style="margin-left:70px;font-size:40px;">运维变更系统</h1>
    <el-form
      ref="classObject"
      :rules="rules"
      :model="classObject"
      label-width="100px"
    >
      <el-form-item label="操作日期" prop="opDay">
        <el-col :span="12" align="left">
          <el-date-picker
            type="date"
            v-model="classObject.opDay"
            id="day"
            name="opDay"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item align="left" label="变更时间段" prop="period">
        <el-select id="sel" v-model="classObject.period" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="操作类型" align="left" prop="opType">
        <el-checkbox-group
          v-model="classObject.opType"
          v-for="(item, index) in changeOP"
          :key="index"
        >
          <el-checkbox :label="item"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <p align="left" style="margin-left: 90px">
        <el-tooltip
          effect="dark"
          content="添加新的操作类型"
          placement="top-start"
        >
          <el-button
            size="small"
            icon="el-icon-plus"
            circle
            @click="open"
          ></el-button>
        </el-tooltip>
      </p>

      <el-form-item label="变更系统" prop="changedSystem">
        <el-col :span="12">
          <el-input
            v-model="classObject.changedSystem"
            name="changedSystem"
            clearable
          />
        </el-col>
      </el-form-item>

      <el-form-item label="变更内容" prop="operateContent">
        <el-col :span="12">
          <el-input
            type="textarea"
            v-model="classObject.operateContent"
            name="operateContent"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="操作人" prop="operator">
        <el-col :span="12">
          <el-input
            type="text"
            v-model="classObject.operator"
            clearable
            name="operator"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="需求人" prop="demander">
        <el-col :span="12">
          <el-input
            prop="demander"
            type="text"
            v-model="classObject.demander"
            clearable
            name="demander"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="影响范围">
        <el-col :span="12">
          <el-input type="textarea" v-model="classObject.note" name="note" />
        </el-col>
      </el-form-item>
    </el-form>
    <span align="left">
    <el-button type="primary" @click="submitForAdd('classObject')">添加</el-button>
    <el-button type="info" @click="toSearchPage">查询全部</el-button>
    <!-- <el-button type="warning" @click="logout">测试注销</el-button> -->
    <!-- <p>{{ classObject }}</p> -->
    <!--<p>{{period}}</p> -->
    </span>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import Util from "../util.js";
import myMenu from "./Menu"
const axios = require("axios");
export default {
  name: "HelloWorld",
  components:{myMenu: myMenu},
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      classObject: {
        opDay: null,
        opStart: null,
        opEnd: null,
        opType: [],
        changedSystem: null,
        operateContent: null,
        operator: null,
        demander: null,
        note: null,
        period: null,
      },
      rules: {
        opDay: [
          { required: true, message: "请选择操作日期", trigger: "change" },
        ],
        period: [
          { required: true, message: "请选择变更时间段", trigger: "change" },
        ],
        opType: [
          {
            required: true,
            message: "请至少选择一个变更类型",
            trigger: "change",
          },
        ],
        changedSystem: [
          { required: true, message: "请输入变更系统", trigger: "blur" },
        ],
        operateContent: [
          { required: true, message: "请输入变更内容", trigger: "blur" },
        ],
        operator: [
          { required: true, message: "请输入操作人", trigger: "blur" },
        ],
        demander: [
          { required: true, message: "请选择需求人", trigger: "blur" },
        ],
      },
      pushContent: {
        msgtype: "markdown",
        markdown: {
          content: "",
        },
      },
      options: [
        { value: 1, label: "13:30-14:30" },
        { value: 2, label: "14:30-15:30" },
        { value: 3, label: "15:30-16:30" },
        { value: 4, label: "16:30-17:00" },
        { value: 5, label: "23:00-06:00" },
        { value: 6, label: "已申请非发布窗口期变更" },
      ],
      changeOP: [
        "服务器变更",
        "域名变更",
        "数据库变更",
        "配置变更",
        "网络变更",
        "其他变更",
      ],
    };
  },
  mounted: function () {
    Util.isPermitted();
    var now = new Date();
    $("#day").val(this.timeFormate(now, 0));
    console.log(localStorage.token);
    // $("#start").val(this.timeFormate(now, 1));
    // now.setTime(now.getTime() + 30 * 60 * 1000);
    // $("#end").val(this.timeFormate(now, 1));
  },
  methods: {
    testPush: function () {
      var that = this;
      that.pushContent.markdown.content =
        "## 登记数据新增\n" +
        "变更时间段：" +
        (that.classObject.opStart != null && that.classObject.opEnd != null
          ? '<font color="comment">' +
            that.classObject.opStart +
            "-" +
            that.classObject.opEnd.substring(11) +
            "</font>"
          : '<font color="comment">' +
            that.classObject.opDay.substring(0, 10) +
            " 已申请非发布窗口期变更</font>") +
        '\n >变更类型：<font color="warning">' +
        that.classObject.opType +
        "</font>" +
        '\n >变更系统：<font color="info">' +
        that.classObject.changedSystem +
        "</font>" +
        '\n >操作内容：<font color="comment">' +
        that.classObject.operateContent +
        "</font>" +
        "\n >操作人：**" +
        that.classObject.operator +
        "**" +
        "\n >需求人：**" +
        that.classObject.demander +
        "**" +
        '\n >影响范围：<font color="comment">' +
        that.classObject.note +
        "</font>";
      axios
        .post(
          `/api/cgi-bin/webhook/send?key=d3dfb6a6-e884-48e9-90f6-701bbb40352c`,
          that.pushContent
        )
        .then((res) => {
          console.log("res=>", res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    check: function () {
      if (
        $("#day").val() != null &&
        this.classObject.period != null     
      ) {
        this.classObject.opDay = $("#day").val() + " 00:00:00";
        switch (this.classObject.period) {
          case 1:
            this.classObject.opStart = $("#day").val() + " 13:30:00";
            this.classObject.opEnd = $("#day").val() + " 14:30:00";
            break;
          case 2:
            this.classObject.opStart = $("#day").val() + " 14:30:00";
            this.classObject.opEnd = $("#day").val() + " 15:30:00";
            break;
          case 3:
            this.classObject.opStart = $("#day").val() + " 15:30:00";
            this.classObject.opEnd = $("#day").val() + " 16:30:00";
            break;
          case 4:
            this.classObject.opStart = $("#day").val() + " 16:30:00";
            this.classObject.opEnd = $("#day").val() + " 17:00:00";
            break;
          case 5:
            this.classObject.opStart = $("#day").val() + " 23:00:00";
            this.classObject.opEnd = $("#day").val() + " 06:00:00";
            break;
        }
        // this.classObject.opStart = $("#start").val().replace("T", " ") + ":00";
        // this.classObject.opEnd = $("#end").val().replace("T", " ") + ":00";
        return true;
      } else return false;
    },
    submitSucess: function () {
      this.$alert("你已成功添加", "通知", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: 'success',
            message: `操作成功`,
          });
        },
      });
    },
    submitForAdd: function (formName) {
      this.check();
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $.ajax({
            type: "POST",
            dataType: "json",
            headers:{
            'token':localStorage.token
            },
            url: process.env.VUE_APP_API_URL + "/addChange",
            data: that.classObject,
            success: function (result) {
              if(result.code==601||result.code==602){
                Util.isPermitted();
              }
              else if(result.code==200){
                // that.testPush();
                that.submitSucess();
              }
              
            },
            error: function () {
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

    addBox: function (val) {
      this.changeOP.push(val);
    },
    open: function () {
      var that = this;
      this.$prompt("请输入新的变更类型名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function (value) {
          if (value == null || value.trim() == "") {
            return false;
          } else return true;
        },
        inputErrorMessage: "输入应该非空",
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "添加的新类型是: " + value,
          });
          that.addBox(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },

    toSearchPage: function () {
      window.location.href = "/#/search";
    },
    timeFormate: function (now, d) {
      var year = now.getFullYear();
      var month =
        now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1;
      var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
      var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      var minute =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      if (d == 0) {
        return year + "-" + month + "-" + day;
      } else {
        return year + "-" + month + "-" + day + "T" + hour + ":" + minute;
      }
    },
  },
};
</script>

<style>

</style>