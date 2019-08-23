<template>
  <div class="login">
   <el-form ref="form" :model="form" :rules='rules' label-width="80px" status-icon>
     <img src="../assets/avatar.jpg" alt="" class="logo">
  <el-form-item label="用户名" prop='username'>
    <el-input  @keyup.enter.native='login' v-model="form.username" placeholder="请输入用户名"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop='password'>
    <el-input  @keyup.enter.native='login' type='password' v-model="form.password" placeholder="请输入密码"></el-input>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button @click='restForm'>重置</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [

          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度为3到12位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度为3到12位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    restForm () {
      this.$refs.form.resetFields()
    },

    async login () {
      try {
        await this.$refs.form.validate()

        // 发送ajax请求
        const { meta, data } = await this.$axios.post('login', this.form)

        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          localStorage.setItem('token', data.token)
          this.$router.push('/index')
        } else {
          console.log(meta.msg)
          this.$message({
            message: meta.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

}

</script>

<style lang="scss">
   .login{
     height: 100%;
     width: 100%;
     background-color:#2d434c;
     overflow: hidden;
     .el-form{
       width: 400px;
       margin: 0 auto;
       background-color: #fff;
       padding: 20px;
       margin-top: 200px;
       padding-top: 80px;
       position: relative;
       .el-button--default{
         margin-left: 80px
       }
       .logo{
         position: absolute;
         top: -70px;
         left: 50%;
         transform: translateX(-50%);
         border-radius: 50%;
         border: 5px solid #fff
       }
     }
   }
</style>
