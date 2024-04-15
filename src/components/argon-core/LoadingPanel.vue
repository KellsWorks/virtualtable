<template>
  <div class="row" v-loading="isLoading" id="loading"></div>
</template>

<script setup>
import { ref } from 'vue';
import { Loading } from 'element-plus';

const isLoading = ref(true);
Loading.directive;
</script>

<style>
#loading {
  min-height: 200px;
  display: flex;
  align-items: center;
}
.el-loading-spinner .path {
  stroke: #66615b !important;
}
.el-loading-mask {
  /* background: transparent !important; */
}
</style>
