<template>
  <div class="demo-image">
    
  </div>
</template>


<script>
import $ from "jquery";
export default {
  data() {
    return {
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      aa:0
    };
  },
  mounted:function(){
    for(var i=0;i<4;i++){
      console.log(i);
      this.aa = i;
      console.log(this.aa);
    }
  },
};


</script>