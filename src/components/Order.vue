<template>
  <div>
    <el-container>
      <el-header>
        <myMenu ref="myMenu"></myMenu>
      </el-header>
      <el-main>
          <el-col :span="9">
          <el-card class="flight">
            <div id="cardHead">当前航班</div>
            <p></p>
            <span>航班名称：{{ curFlight.fName }}</span><br/>
            <span>飞机型号：{{ curFlight.pName }}</span><br/>
            <span>出发时间：{{ curFlight.startTime }}</span><br/>
            <span>预计抵达时间：{{ curFlight.endTime }}</span><br/>
            <span>出发地：{{ curFlight.from }}</span><br/>
            <span>目的地：{{ curFlight.destination }}</span><br/>
            <p></p>
            <a id="backLink" href="javascript:history.go(-1)">重选航班</a>
          </el-card>
          <br/>
          <el-table :data="passengers" stripe border height="320px" id="passTable">
                <el-table-column label="可选乘客列表" align="center">
            <el-table-column prop="pIdnum" label="身份证号" width="180">
            </el-table-column>
            <el-table-column prop="pRealname" label="真实姓名" width="120">
            </el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button size="medium" type="primary" @click="addPassenger2List(scope.row)" plain>加入乘客</el-button>
              </template>
            </el-table-column>
                </el-table-column>
          </el-table>
          </el-col>
          <el-col :span="15">
              <el-button type="primary" style="margin-left:85%;">添加新乘客</el-button>
                <el-table :data="curPassenger" show-summary :summary-method="getSummaries" stripe height="600px" border id="curPass">
                <el-table-column align="center" label="已选乘客列表">
            <el-table-column prop="pIdnum" label="身份证号" width="180">
            </el-table-column>
            <el-table-column prop="pRealname" label="真实姓名" width="120">
            </el-table-column>
            <el-table-column label="机票类型" width="120px">
              <template slot-scope="scope">
                <el-select v-model="curTicket[scope.$index]" @change="updatePrice(scope.$index)">
                    <el-option v-for="item in options" :key="item.tId" :label="item.tName" :value="item.tId">
                    </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="tPrice">
            </el-table-column>
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button size="medium" type="warning" @click="delCurPass(scope.row,scope.$index)" plain>删除</el-button>
              </template>
            </el-table-column>
                </el-table-column>
          </el-table>
          </el-col>
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
  name: "Order",
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
    return {
      curFlight: {
        fId: null,
        fName: null,
        pId: null,
        pName: null,
        startTime: null,
        endTime: null,
        from: null,
        destination: null,
      },
      passengers: [],
      idnums:[],
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
      curPassenger:[],
      options:[{
          tName:"经济舱",
          tId:1,
          tPrice:0
      },
      {
          tName:"商务舱",
          tId:2,
          tPrice:0
      },
      {
          tName:"头等舱",
          tId:3,
          tPrice:0
      }],
      curTicket:[]
    };
  },
  mounted: function () {
    Util.isPermitted();
    var addrstr = location.href;
    this.curFlight.fId = addrstr.substring(addrstr.indexOf("fId") + 4);
    this.getFlightInfo();
    this.initPassenger();
    this.getUserInfo();
    this.getTicketInfo();
  },
  methods: {
    alertHelper(msg, mType) {
      this.$message({
        type: mType,
        message: msg,
      });
    },
    getFlightInfo: function () {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:
          process.env.VUE_APP_API_URL +
          "/getFlightById?fId=" +
          that.curFlight.fId,
        success: function (result) {
          if (result.code == 200) {
            that.curFlight.fName = result.data.fName;
            that.curFlight.pId = result.data.pId;
            that.curFlight.startTime = that.timeFormate(result.data.startTime);
            that.curFlight.endTime = that.timeFormate(result.data.endTime);
            that.curFlight.from = result.data.from;
            that.curFlight.destination = result.data.destination;
            that.getPlaneInfo();
          }
        },
        error: function () {
          that.alertHelper("系统内部异常", "error");
        },
      });
    },

    getPlaneInfo: function () {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:
          process.env.VUE_APP_API_URL +
          "/admin/getPlaneById?pId=" +
          that.curFlight.pId,
        success: function (result) {
          if (result.code == 200) {
            that.curFlight.pName = result.data.pName;
          }
        },
        error: function () {
          that.alertHelper("系统内部异常", "error");
        },
      });
    },

    getUserInfo:function(){
        var that = this;
        $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
          account: localStorage.account
        },
        url: process.env.VUE_APP_API_URL +"/getUserByAccount",
        success: function (result) {
          if (result.code == 200) {
            that.curPassenger = [];
            result.data.pIdnum = result.data.uIdnum;
            result.data.pRealname = result.data.uRealname;
            that.curPassenger.push(result.data);
          }
          else{
              that.alertHelper(result.msg,"error");
          }
        },
        error: function () {
          that.alertHelper("系统内部异常", "error");
        },
      });
    },

    getTicketInfo:function(){
        var that = this;
        $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url: process.env.VUE_APP_API_URL +"/getTicketsByFid?fid="+that.curFlight.fId,
        success: function (result) {
          if (result.code == 200) {
            for(var i=0;i<3;i++){
                that.options[result.data[i].rank-1].tId = result.data[i].tId;
                that.options[result.data[i].rank-1].tPrice = result.data[i].tPrice;
            }
            that.curTicket[0] = result.data[0].tId;
            that.curPassenger[0].tPrice = 0;
            that.curPassenger[0].tPrice = result.data[0].tPrice;
          }
          else{
              that.alertHelper(result.msg,"error");
          }
        },
        error: function () {
          that.alertHelper("系统内部异常", "error");
        },
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

    addPassenger2List:function(newData){
        if(this.curPassenger.indexOf(newData)!=-1){
            this.alertHelper("您已添加该乘客","warning");
            return;
        }
        this.curPassenger.push(newData);
        this.curTicket[this.curPassenger.length-1]=this.options[0].tId;
        this.curPassenger[this.curPassenger.length-1].tPrice=this.options[0].tPrice;
    },

    delCurPass:function(target,pIndex){
        var index = this.curPassenger.indexOf(target);
        if(index!=-1){
            this.curPassenger.splice(index,1);
            this.curTicket.splice(pIndex,1);
        }
    },

    updatePrice:function(index){
        var tid = this.curTicket[index];
        for(var i=0;i<3;i++){
            if(this.options[i].tId==tid){
                this.curPassenger[index].tPrice = this.options[i].tPrice;
                break;
            }
        }
    },

    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        var that = this;
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if(index === 1){
              sums[index] = that.curPassenger.length + "人";
          }
          if(index === 3){
              sums[index] = 0;
              console.log(column.label);
              for(var i=0;i<that.curPassenger.length;i++){
                 console.log(that.curPassenger[i].tPrice);
              }
          }
        //   const values = data.map(item => Number(item[column.property]));
        //   if (!values.every(value => isNaN(value))) {
        //     sums[index] = values.reduce((prev, curr) => {
        //       const value = Number(curr);
        //       if (!isNaN(value)) {
        //         return prev + curr;
        //       } else {
        //         return prev;
        //       }
        //     }, 0);
        //     sums[index] += ' 元';
        //   } else {
        //     sums[index] = 'N/A';
        //   }
        });

        return sums;
      },

    timeFormate(data) {
      var date = new Date(data);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
  },
};
</script>

<style>
.flight {
  width: 95%;
}
#cardHead {
  margin-left: 20%;
  font-size: 20px;
  color: blue;
  font-style: italic;
}
#backLink {
  color: rgb(36, 2, 207);
}
#backLink:hover {
  color: rgb(219, 0, 0);
}
#passTable{
  width: 95%;
}
#curPass{
    width:622px;
    margin-left:17%;
    height:500px;
}
</style>