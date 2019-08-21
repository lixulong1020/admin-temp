<template>
  <div id="app">
<router-view></router-view>

  </div>
</template>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
    list-style: none
  }
  html,body,#app{
    height: 100%;
    width: 100%
  }
  #app{
      .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc
  }
  }
</style>
