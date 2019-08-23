<template>
    <el-container class="index">
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt />
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="autologin">
          欢迎光临~
          <a href="javascript:;" @click='logut'>退出</a>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu
            unique-opened
                 router
                 :default-active='defaultActive'
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">

              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>{{menu.authName}}</span>
              </template>
              <el-menu-item :index='item.path' v-for="item in menu.children" :key="item.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.authName}}</span>
              </el-menu-item>
            </el-submenu>

  </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1).split('-')[0]
    }
  },
  methods: {
    logut () {
      this.$confirm('亲, 你确认要退出系统吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('login')
      }).catch(() => {
        this.$message('取消退出')
      })
    }
  }

}
</script>

<style lang='scss' scoped>
.index {
  height: 100%;
  .el-header {
      background-color: #d8d8d8;
      display: flex;
      .logo {
        width: 180px;
        img {
          height: 40px;
          margin: 10px;
        }
      }
      .title {
        flex: 1;
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #545c64;
      }
      .autologin {
        text-align: right;
        height: 60px;
        line-height: 60px;
        font-weight: 700;

        a {
          color: orange;
        }
      }
    }

    .el-aside {
      background: #545c64;
      .el-menu{
        border-right: none
      }
    }
    .el-main {
      background: #ecf0f1;

    }

}
</style>
