import $ from 'jquery';
var myFunc={
    isPermitted:function(){
        $.ajax({
            type:"GET",
            dataType:"json",
            headers:{
              'token':localStorage.token
            },
            url:process.env.VUE_APP_API_URL+"/valid",
            success:function(result){
              if(result.code!=200||result.data!=localStorage.userId){
                window.location.href="/#/login?permit=false";
              }
              else{
                console.log("you are permitted!");
              }
            }
          });
    },
    accountIsExist(value) {
      var that = this;
      var re = false;
      $.ajax({
        type: "GET",
        dataType: "json",
        url: process.env.VUE_APP_API_URL + "/accountIsExist?account=" + value,
        async: false,
        headers: {
          token: localStorage.token,
        },
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
          re = result;
        },
      });
      return re;
    },
    idnumIsExist(value) {
      var that = this;
      var re = false;
      var reqUrl = process.env.VUE_APP_API_URL + "/idnumIsExist?idnum=" + value;
      $.ajax({
        type: "GET",
        dataType: "json",
        url: reqUrl,
        async: false,
        headers: {
          token: localStorage.token,
        },
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
          re = result;
        },
      });
      return re;
    },
}

export default myFunc