<template>
    <div>
        <el-container>
            <el-header>
                <myMenu ref="myMenu"></myMenu>
            </el-header>
            <el-main>
                <el-table :data="retFlights" stripe border>
                    <el-table-column prop="fName" width="90px" label="航班编号"></el-table-column>
                    <el-table-column prop="from" width="70px" label="出发地"></el-table-column>
                    <el-table-column prop="destination" width="70px" label="目的地"></el-table-column>
                    <el-table-column prop="startTime" label="出发时间"></el-table-column>
                    <el-table-column prop="endTime" label="预计抵达时间"></el-table-column>
                    <el-table-column prop="fEco" width="185px" label="经济舱"></el-table-column>
                    <el-table-column prop="fBus" width="185px" label="商务舱"></el-table-column>
                    <el-table-column prop="fFc" width="185px" label="头等舱"></el-table-column>
                    <el-table-column width="100px" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="toOrder(scope.row.fId)">购买</el-button>
                    </template>
                    </el-table-column>
                </el-table>
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
    name: 'Flight',
    components: { myMenu: myMenu },
    data(){
        return{
            flight:{
                from:null,
                to:null,
                startDay:null
            },
            retFlights:[],
            fIds:[],
        }
    },
    mounted:function(){
        var url = location.href;
        var index = url.indexOf("?")+1;
        var query = url.substring(index);
        var args = query.split("&");
        this.flight.from = decodeURI(args[0].substring(args[0].indexOf("=")+1));
        this.flight.to = decodeURI(args[1].substring(args[1].indexOf("=")+1));
        this.flight.startDay = args[2].substring(args[2].indexOf("=")+1);

        var that = this;
        $.ajax({
            type:"POST",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            headers: {
              token: localStorage.token,
            },
            url: process.env.VUE_APP_API_URL + "/getFlightByDetail",
            data: JSON.stringify(that.flight),
            success: function (result) {
                that.retFlights=[];
                that.fIds=[];
                for(var i=0;i<result.data.length;i++){
                    result.data[i].startTime = that.timeFormate(result.data[i].startTime);
                    result.data[i].endTime = that.timeFormate(result.data[i].endTime);
                    that.fIds.push(result.data[i].fId);
                    that.retFlights.push(result.data[i]);
                }
                that.getTicketData();
            },
            error:function(err){
                that.alertHelper("系统内部异常","error");
            }
            
        });
    },
    methods:{
      getTicketData(){
          var that = this;
          $.ajax({
            type:"Post",
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            headers: {
              token: localStorage.token,
            },
            url: process.env.VUE_APP_API_URL + "/getByFidList",
            data: JSON.stringify(that.fIds),
            success:function(result){
                for(var i=0;i<result.data.length;i=i+3){
                    that.retFlights[i/3].fEco = "票余量："+that.retFlights[i/3].fEco+"，价格："+result.data[i].tPrice;
                    that.retFlights[i/3].fBus = "票余量："+that.retFlights[i/3].fBus+"，价格："+result.data[i+1].tPrice;
                    that.retFlights[i/3].fFc = "票余量："+that.retFlights[i/3].fFc+"，价格："+result.data[i+2].tPrice;
                }
            }
          });
      },
      alertHelper(msg, mType) {
        this.$message({
        type: mType,
        message: msg,
        });
      },

      timeFormate(data){
        var date = new Date(data);
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        return Y + M + D + h + m
      },

      toOrder:function(fId){
          window.location.href="/#/order?fId="+fId;
      }
    }
}
</script>