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
          <el-table :data="passengers" stripe height="350px" broder id="passTable">
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
              <el-button type="primary" style="margin-left:85%;" @click="addPassDialog = true">添加新乘客</el-button>
                <el-table :data="curPassenger" stripe height="600px" border id="curPass">
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
                <el-button size="medium" type="danger" @click="delCurPass(scope.row,scope.$index)" plain>删除</el-button>
              </template>
            </el-table-column>
                </el-table-column>
          </el-table>
          </el-col>
      </el-main>
      {{curTicket}}
      <div class="footer">
        <div class="pay"><span>乘客共有 <span style="color:blue">{{curPassenger.length}}</span> 人，总计金额为<span style="color:red">￥{{priceSum}}  </span></span>
            <el-button round type="warning" @click="createOrder()">创建订单</el-button></div>
      </div>
    </el-container>
{{orderItem}}
    <el-dialog title="乘客新增" :visible.sync="addPassDialog" width="30%" center>
      <span slot="footer" class="dialog-footer">
        <el-form ref="newPass" :model="newPass" :rules="passRule">
          <el-form-item label="真实姓名" prop="pRealname">
            <el-input v-model="newPass.pRealname"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="pIdnum">
            <el-input v-model="newPass.pIdnum"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addPassDialog = false">取 消</el-button>
        <el-button type="primary" @click="addPass('newPass')">保 存</el-button>
      </span>
    </el-dialog>

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
      const sums = [];
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
      addPassDialog:false,
      newPass: {
        pIdnum: null,
        pRealname: null,
        uId: null,
      },
      priceSum:0,
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
      curTicket:[],
      newOrder:{
        uId:null,
        totalPrice:0
      },
      orderItem:{
        oid:null,
        tid:null,
        uid:null,
        idnum:null,
        pRealname:null
      }
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
            that.priceSum = result.data[0].tPrice;
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
                  that.addPassDialog = false;
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

    addPassenger2List:function(newData){
        if(this.curPassenger.indexOf(newData)!=-1){
            this.alertHelper("您已添加该乘客","warning");
            return;
        }
        this.curPassenger.push(newData);
        this.curTicket[this.curPassenger.length-1]=this.options[0].tId;
        this.curPassenger[this.curPassenger.length-1].tPrice=this.options[0].tPrice;
        this.getPriceSum();
    },

    delCurPass:function(target,pIndex){
        var index = this.curPassenger.indexOf(target);
        if(index!=-1){
            this.curPassenger.splice(index,1);
            this.curTicket.splice(pIndex,1);
            this.getPriceSum();
        }
    },

    updatePrice:function(index){
        var tid = this.curTicket[index];
        for(var i=0;i<3;i++){
            if(this.options[i].tId==tid){
                this.curPassenger[index].tPrice = this.options[i].tPrice;
                this.getPriceSum();
                break;
            }
        }
    },

    getPriceSum:function(){
      this.priceSum = 0;
      console.log("aaaaaaaas");
      for(var i=0; i<this.curPassenger.length;i++){
        this.priceSum += this.curPassenger[i].tPrice;
      }
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

    createOrder:function(){
      if (localStorage.userId == null) {
      this.alertHelper("登录信息失效，请重新登录", "error");
      setTimeout(function () {
        window.location.href = "/#/login";
        }, 2000);
      }
      else{
        this.newOrder.uId = localStorage.userId;
        var that = this;
        $.ajax({
          type: "POST",
          dataType: "json",
          async: false,
          contentType: "application/json;charset=UTF-8",
          headers: {
            token: localStorage.token,
          },
          url: process.env.VUE_APP_API_URL + "/addOrder",
          data: JSON.stringify(that.newOrder),
          success:function(result){
            if(result.code == 101){
              that.alertHelper(result.msg,"error");
            }
            else if(result.code == 200){
              /**
               * 获取新增订单的id
               */
              var newOid = result.data;
              
              for(var i=0; i<that.curPassenger.length; i++){
                that.orderItem.oid = newOid;
                that.orderItem.uid = localStorage.userId;
                that.orderItem.tid = that.curTicket[i];
                that.orderItem.pRealname = that.curPassenger[i].pRealname;
                that.orderItem.idnum = that.curPassenger[i].pIdnum;
                /**
                 * 添加订单项
                 */
                that.addOrderItem();
              }
              /**
               * 添加订单项完毕后，更新订单总额
               */
              that.updateTotalPrice(newOid);
            }
          },
          error:function(err){
            that.alertHelper("创建订单异常","error");
          }
        });

      }
    },

    addOrderItem:function(){
      var that = this;
      if(that.orderItem.oid!=null&&that.orderItem.tid!=null){
        $.ajax({
          type: "POST",
          dataType: "json",
          async: false,
          contentType: "application/json;charset=UTF-8",
          headers: {
            token: localStorage.token,
          },
          url: process.env.VUE_APP_API_URL + "/addItem",
          data: JSON.stringify(that.orderItem),
          success:function(result){
            console.log(result);
          },
          error:function(err){
            that.alertHelper("创建子订单异常"+that.orderItem,"error");
          }
        });
      }
      
    },

    updateTotalPrice:function(oid){
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:process.env.VUE_APP_API_URL + "/updateTotalPrice?oid=" + oid,
        success: function (result) {
        }
      });
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
.footer{
    position: fixed;
    background-color: rgb(195, 241, 255);
    top:93%;
    height:16%;
    width:100%;
    z-index:99990;
}
.pay{
  position: relative;
  left:71%;
  z-index:99999;
}
</style>