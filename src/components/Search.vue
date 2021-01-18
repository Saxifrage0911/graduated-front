<template>
  <div class="bac" align="center">
  <el-container>
    <el-header>
      <myMenu ref="myMenu" ></myMenu>
    </el-header>
    <el-main>
      
        <el-card shadow="hover" class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px">航班查询</span>
          </div>
          <el-form
            label-position="left"
            ref="flight"
            :model="flight"
            :rules="rules"
          >
            <el-form-item label="出发地" prop="from">
              <el-input
                v-model="flight.from"
                placeholder="填写出发城市"
              ></el-input>
            </el-form-item>

            <el-form-item label="目的地" prop="to">
              <el-input
                v-model="flight.to"
                placeholder="填写目的城市"
              ></el-input>
            </el-form-item>

            <el-form-item label="出发日期" prop="startDay">
              <el-col :span="4">
                <el-date-picker
                  type="date"
                  v-model="flight.startDay"
                  id="day"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-button type="primary" @click="toSearch('flight')">查询航班</el-button>
          </el-form>
          <br />
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
  name: "Search",
  components: { myMenu: myMenu },
  data() {
    return {
      flight: {
        from: null,
        to: null,
        startDay: null,
      },
      rules: {
        from: [{ required: true, message: "请输入出发地", trigger: "blur" }],
        to: [{ required: true, message: "请输入目的地", trigger: "blur" }],
        startDay: [
          { required: true, message: "请输入出发日期", trigger: "change" },
        ],
      },
      pickerOptions:{
        disabledDate(time) {
            return time.getTime()+3600 * 1000 * 24 < Date.now();
          },
      }
    };
  },

  methods:{
    toSearch:function(formName){
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var year = this.flight.startDay.getFullYear();
          var month = this.flight.startDay.getMonth() + 1 < 10 ? "0" + (this.flight.startDay.getMonth() + 1):this.flight.startDay.getMonth() + 1;
          var day = this.flight.startDay.getDate() < 10 ? "0" + this.flight.startDay.getDate() : this.flight.startDay.getDate();
          that.flight.startDay = year+"-"+month+"-"+day;
          window.location.href = '/#/flight?from='+encodeURI(this.flight.from)+"&to="+
                                  encodeURI(this.flight.to)+
                                 "&startDay="+this.flight.startDay;
        }
        else{
          console.log("error submit!");
        }
      });
    }
  }
};
</script>

<style>
.bac {
  background-image: url("../assets/plane4.jpg");
  background-repeat:no-repeat;
  background-size:100% 100%;
}
.text {
  font-size: 30px;
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
  background-color: #a9ebeb;
  width: 480px;
}
</style>