<template>
  <div id="app">
<router-view></router-view>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html, body, #app {
  width: 100%;
  height: 100%;
}
#app {
  // 统一设置面包屑
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
}
</style>
