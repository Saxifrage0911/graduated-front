<template>
  <div>
    <el-container>
      <el-header>
        <myMenu ref="myMenu"></myMenu>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="已完成订单" name="finished">
            <el-table :data="finishedList" stripe border style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <h3>乘客信息</h3>
                    <el-form-item
                      v-for="item in props.row.itemList"
                      :key="item.itemId"
                    >
                      <span>真实姓名：{{ item.pRealname }}</span
                      ><br />
                      <span>身份证号：{{ item.pIdnum }}</span
                      ><br />
                      <span>机票单价：{{ item.itemPrice }}￥</span><br />
                      <span v-if="item.seat == 'none'">暂未分配座位</span><br />
                      <span v-if="item.seat != 'none'"
                        >飞机座位：{{ item.seat }}</span
                      >
                      <el-divider
                        ><i class="el-icon-mobile-phone"></i
                      ></el-divider>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="oId" label="订单号"> </el-table-column>
              <el-table-column prop="from" label="出发地"> </el-table-column>
              <el-table-column prop="destination" label="目的地">
              </el-table-column>
              <el-table-column prop="startTime" width="180" label="出发时间">
              </el-table-column>
              <el-table-column prop="endTime" width="180" label="预计抵达时间">
              </el-table-column>
              <el-table-column prop="createTime" width="180" label="订单创建时间">
              </el-table-column>
              <el-table-column prop="payTime" width="180" label="支付时间">
              </el-table-column>
              <el-table-column prop="totalPrice" label="总金额">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-popconfirm
                    confirm-button-text="是的"
                    cancel-button-text="不用了"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定退款该订单吗？"
                    @confirm="cancelOrder(scope.row.oId)"
                  >
                    <el-button slot="reference" type="danger">退单</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              :current-page="curFP"
              @current-change="getFinishedOrderList"
              layout="prev, pager, next"
              :total="numOfFinished"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="未完成订单" name="unfinished">
            <el-table :data="unfinishedList" stripe border style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <h3>乘客信息</h3>
                    <el-form-item
                      v-for="item in props.row.itemList"
                      :key="item.itemId"
                    >
                      <span>真实姓名：{{ item.pRealname }}</span
                      ><br />
                      <span>身份证号：{{ item.pIdnum }}</span
                      ><br />
                      <span>机票单价：{{ item.itemPrice }}￥</span><br />
                      <span v-if="item.seat == 'none'">暂未分配座位</span><br />
                      <span v-if="item.seat != 'none'"
                        >飞机座位：{{ item.seat }}</span
                      >
                      <el-divider
                        ><i class="el-icon-mobile-phone"></i
                      ></el-divider>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="oId" label="订单号"> </el-table-column>
              <el-table-column prop="from" label="出发地"> </el-table-column>
              <el-table-column prop="destination" label="目的地">
              </el-table-column>
              <el-table-column prop="startTime" label="出发时间">
              </el-table-column>
              <el-table-column prop="endTime" label="预计抵达时间">
              </el-table-column>
              <el-table-column prop="createTime" label="订单创建时间">
              </el-table-column>
              <el-table-column prop="totalPrice" label="总金额">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="overdue"
                    placement="top"
                  >
                    <el-button
                      v-if="scope.row.status == 0"
                      @click="payOrder(scope.row.oId)"
                      @mouseover.native="updateOverdue(scope.row.createTime)"
                      @mouseleave.native="clearInter()"
                      type="success"
                      >支付</el-button
                    >
                  </el-tooltip>
                  <el-popconfirm
                    confirm-button-text="好的"
                    cancel-button-text="不用了"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定取消该订单吗？"
                    @confirm="cancelOrder(scope.row.oId)"
                  >
                    <el-button
                      v-if="scope.row.status == 0"
                      slot="reference"
                      type="warning"
                      >取消</el-button
                    >
                  </el-popconfirm>
                  <span v-if="scope.row.status == 2" style="color: red"
                    >订单已过期</span
                  >
                  <span v-if="scope.row.status == 3" style="color: orange"
                    >订单已取消</span
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              :current-page="curUP"
              @current-change="getUnfinishedOrderList"
              layout="prev, pager, next"
              :total="numOfUnfinished"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
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
  name: "OrderList",
  components: { myMenu: myMenu },
  data() {
    return {
      activeName: "finished",
      finishedList: [],
      numOfFinished:0,
      numOfUnfinished:0,
      curFP:1,
      curUP:1,
      unfinishedList: [],
      overdue: "",
      createTime: "",
      inter: null,
    };
  },
  mounted: function () {
    var url = location.href;
    var index = url.indexOf("type") + 5;
    this.activeName = url.substring(index);
    this.getFinishedOrderList(1);
    this.getUnfinishedOrderList(1);
    this.getNumOfOrder();
  },
  methods: {
    alertHelper(msg, mType) {
      this.$message({
        type: mType,
        message: msg,
      });
    },

    getNumOfOrder:function(){
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:
          process.env.VUE_APP_API_URL + "/getOrderCount?uid=" + localStorage.userId,
        success: function (result) {
          if (result.code == 200) {
            that.numOfFinished = result.data.numOfFinished;
            that.numOfUnfinished = result.data.numOfUnfinished;
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常，请稍后重试", "error");
        },
      });
    },

    getFinishedOrderList: function (val) {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:
          process.env.VUE_APP_API_URL + "/getFOrder?uid=" + localStorage.userId+"&pageNo="+val+"&pageSize=10",
        success: function (result) {
          if (result.code == 200) {
            that.finishedList = result.data;
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常，请稍后重试", "error");
        },
      });
    },

    getUnfinishedOrderList: function (val) {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url:
          process.env.VUE_APP_API_URL + "/getUOrder?uid=" + localStorage.userId+"&pageNo="+val+"&pageSize=10",
        success: function (result) {
          if (result.code == 200) {
            that.unfinishedList = result.data;
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常，请稍后重试", "error");
        },
      });
    },

    payOrder: function (oid) {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url: process.env.VUE_APP_API_URL + "/payOrder?oid=" + oid,
        success: function (result) {
          if (result.code == 200) {
            that.alertHelper("支付成功", "success");
            that.getFinishedOrderList(1);
            that.getUnfinishedOrderList(1);
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常，请稍后重试", "error");
        },
      });
    },

    cancelOrder: function (oid) {
      var that = this;
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: {
          token: localStorage.token,
        },
        url: process.env.VUE_APP_API_URL + "/cancelOrder?oid=" + oid,
        success: function (result) {
          if (result.code == 200) {
            that.alertHelper("订单取消成功", "success");
            that.getFinishedOrderList(1);
            that.getUnfinishedOrderList(1);
          } else {
            that.alertHelper(result.msg, "error");
          }
        },
        error: function (err) {
          that.alertHelper("系统内部异常，请稍后重试", "error");
        },
      });
    },

    updateOverdue: function (createTime) {
      var that = this;
      this.createTime = createTime;
      this.inter = setInterval(function () {
        that.getOverdue();
      }, 1000);
    },

    clearInter: function () {
      clearInterval(this.inter);
    },

    getOverdue: function () {
      var date1 = new Date(); //开始时间
      var date2 = new Date(Date.parse(this.createTime)); //结束时间
      var date3 = date2.getTime() - date1.getTime() + 1000 * 60 * 30; //时间差的毫秒数

      var minutes = Math.floor(date3 / (60 * 1000)); //计算天数后剩余的毫秒数

      var ll = date3 % (60 * 1000);

      var seconds = Math.round(ll / 1000) - 1;

      if (minutes <= 0 || seconds <= 0) {
        this.overdue = "该订单已过期";
      } else {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.overdue = String(minutes + ":" + seconds + "后过期");
      }
    },
  },
};
</script>
<style>
.el-table th.gutter{
    display: table-cell!important;
 }
.tableTitle {
  position: relative;
  margin: 0 auto;
  width: 600px;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>