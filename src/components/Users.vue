<template>
  <div class="users">

    <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>

</el-breadcrumb>
<!-- 搜索框 -->
  <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select">

    <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
  </el-input>
  <!-- 添加用户 -->
  <el-button type="success" plain class="addbtn" @click="addusers">添加用户</el-button>
   <!-- 表格组件 -->
 <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column

        label="用户状态">

<template v-slot:default='butt'>
<el-switch
@change="changeState(butt.row)"
  v-model="butt.row.mg_state"
  active-color="#13ce66"
  inactive-color="#ff4949">
</el-switch>
</template>
      </el-table-column>
      <el-table-column

        label="操作">
        <template v-slot:default='butt'>
 <el-button type="primary" icon="el-icon-edit" plain   size="small" @click='showEditDialog(butt.row)'></el-button>

    <el-button type="danger" icon="el-icon-delete" plain   size="small" @click='delusers(butt.row.id)'></el-button>
      <el-button type="success" icon="el-icon-check" plain  size="small">
分配角色
      </el-button>
</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">

    </el-pagination>
     <!-- 添加模态框 -->
<el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="adduser" type="primary">确 定</el-button>
      </span>
    </el-dialog>

<!-- 修改模态框 -->

    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="40%">

      <el-form ref="editForm" :model="editForm" :rules="rules" status-icon label-width="100px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '', // 查询参数
      total: 0, // 总条数
      pagenum: 1, // 当前页
      pagesize: 2, // 每页的总条数
      userList: [],
      dialogVisible: false,
      editVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: ['change,blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: ['change,blur'] }
        ],
        email: [

          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [

          { pattern: /^1[3-9]\d{9}$/, message: '长度在 3 到 12个字符', trigger: ['change,blur'] }
        ]
      }

    }
  },
  methods: {

    async   getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        // 浏览器存储token, 每次次请求, 携带token即可
        // 配置请求头

      })
      if (meta.status === 200) {
        // console.log(res.data.data)
        this.total = data.total
        this.userList = data.users
      }
    },
    //
    handleSizeChange (val) {
      this.pagesize = val
      // 每页几条
      // console.log(val)
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      console.log(val)
      // 每页显示几个
      this.getUserList()
    },

    async delusers (id) {
      // console.log(id)
      // 参数1: 内容
      // 参数2: 标题
      // 参数3: 配置 warning success error
      try {
        await this.$confirm('亲, 你确认要进行删除吗?', '温馨提示', {
          type: 'warning'
        })
        // 确认删除, 发送ajax请求
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          // 删除成功
          this.$message.success('删除成功')
          // 如果当前页只有一条, 删除了仅有的一条后, 当前页-1
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染当前页
          this.getUserList()
        } else {
          // 删除失败
          this.$message.error(meta.msg)
        }
      } catch (err) {
        console.log(err)
        this.$message('取消成功')
      }
    },
    // 取消
    // 状态修改
    async changeState (row) {
      try {
        const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)

        if (meta.status === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('meta.msg')
        }
      } catch (e) {
        console.log(e)
      }
    },
    search () {
      this.pagenum = 1
      this.getUserList()
    },
    // 点击显示模态框
    addusers () {
      this.dialogVisible = true
    },
    // 添加新用户
    async adduser () {
      try {
        // 检验
        await this.$refs.form.validate()
        // 请求
        const { meta } = await this.$axios.post('users', this.form)
        console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 关闭模态框
          this.dialogVisible = false
          // 重置表单
          this.$refs.form.resetFields()
          // 重新渲染最后一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (row) {
      this.editVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.mobile = row.mobile
      this.editForm.email = row.email
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        // 校验成功, 发送请求
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { id, email, mobile })
        // const { msg, status } = res.meta
        // console.log(res)

        if (meta.status === 200) {
          this.$message.success('更新成功')
          this.editVisible = false
          this.$refs.editForm.resetFields()
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

}

</script>

<style lang="scss" scoped>
   .users{
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc
  }
  .input-with-select{
    width: 300px;
    margin-bottom: 10px
  }
  .addbtn{
    margin: 0 20px
  }
   }
</style>
