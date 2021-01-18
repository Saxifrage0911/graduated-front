<template>
  <div class="demo-image">
    <img
      id="verification"
      src="http://localhost:8088/defaultKaptcha"
      style="cursor: pointer"
      title="看不清？换一张"
    />
  </div>
</template>


<script>
import $ from "jquery";
export default {
  data() {
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
    };
  },
};

$(function () {
    // 刷新验证码
    $("#verification").bind("click", function () {
        $(this).hide().attr('src', 'http://localhost:8088/defaultKaptcha?random=' + Math.random()).fadeIn();
    });
});
</script>