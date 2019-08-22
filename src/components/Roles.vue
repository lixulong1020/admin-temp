<template>
  <div class="roles">
    <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>

</el-breadcrumb>
<!-- 添加按钮 -->
<el-button plain  type="success" class="add" @click="showAddDialog">添加角色</el-button>
<!-- 表格 -->
<el-table
:data="roleList"
>
<!-- 一级权限 -->
<el-table-column  type="expand">
  <template v-slot:default="{row}">

<el-row v-for="l1 in row.children" :key="l1.id"  class="l1">
  <el-col :span="4">
    <el-tag @close='delRights(row,l1.id)' closable>{{l1.authName}}</el-tag>
    <span class="el-icon-arrow-right"></span>
  </el-col>
  <!-- 二级权限 -->
<el-col :span="20" >
  <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
<el-col :span="4">
     <el-tag @close="delRights(row, l2.id)" closable type="success">{{ l2.authName }}</el-tag>
<span class="el-icon-arrow-right"></span>
</el-col>
<!-- 三级权限 直接在一行中比遍历 展示多个 -->
<el-col :span="20">
  <el-tag @close='delRights(row,l3.id)'  class="l3" v-for="l3 in l2.children" :key="l3.id" type="warning" closable>{{l3.authName}}</el-tag>
</el-col>
  </el-row>
</el-col>
</el-row>
  </template>

</el-table-column>

<el-table-column
type="index"
>

</el-table-column>
<el-table-column
label="角色名称"
prop="roleName"
>

</el-table-column>
<el-table-column
label="描述"
prop="roleDesc"
>

</el-table-column>
<el-table-column
label="操作"
>
<template v-slot:default="{row}">
  <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(row)"></el-button>
  <el-button size="small" plain type="danger" icon="el-icon-delete"  @click="delRoles(row.id)"></el-button>
  <el-button size="small" plain type="success" icon="el-icon-check"
  @click="showCation(row)">
    分配权限
  </el-button>

</template>

</el-table-column>
</el-table>
<!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="addCation" width="40%">
      <el-tree
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
       ref='lis'

      >
      </el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addCation = false">取 消</el-button>
    <el-button type="primary" @click='allocation'>分 配</el-button>
  </span>
</el-dialog>

<!-- 添加的模态框 -->
<el-dialog
  title="添加角色"
  :visible.sync="addVisable"
  width="40%"
  >
 <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisable = false">取 消</el-button>
    <el-button type="primary" @click="saveUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改模态框 -->
<el-dialog
  title="修改"
  :visible.sync="assVisable"
  width="40%"
  >
   <el-form :model="aform" :rules="rules" ref="aform" label-width="80px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="aform.roleName" placeholder="请输入角色名称"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="aform.roleDesc" placeholder="请输入角色描述"></el-input>
  </el-form-item>

</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="assVisable = false">取 消</el-button>
    <el-button type="primary" @click='assuser'>确 定</el-button>
  </span>
</el-dialog>

<!--  -->
</div>
</template>

<script>

export default {
  data () {
    return {
      roleList: [],
      data: [],
      rightId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addVisable: false,
      assVisable: false,
      addCation: false,

      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },

      aform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },

      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }

        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }

        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async  getRolesList () {
      const { meta, data } = await this.$axios.get('roles')
      // console.log(meta)
      if (meta.status === 200) {
        // console.log(data)
        this.roleList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 取消权限
    async  delRights (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      }
    },
    showAddDialog () {
      this.addVisable = true
    },
    // 添加
    async saveUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('roles', this.form)
        if (meta.status === 201) {
          this.getRolesList()
          this.addVisable = false
          // 重置表单
          this.$refs.form.resetFields()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {

      }
    },
    // 修改
    showEditDialog (row) {
      this.assVisable = true
      console.log(row)

      this.aform.id = row.id
      this.aform.roleName = row.roleName
      this.aform.roleDesc = row.roleDesc
      // console.log(this.aform)
    },
    // 修改发送的ajax
    async assuser () {
      try {
        // await this.$refs.aform.validate()

        const { id, roleName, roleDesc } = this.aform

        const { meta } = await this.$axios.put(`roles/${id}`, { roleName, roleDesc })
        console.log(meta)
        if (meta.status === 200) {
          this.assVisable = false
          this.getRolesList()
        }
      } catch (e) {

      }
    },

    // 删除
    async  delRoles (id) {
      try {
        await this.$confirm('你是否要删除该角色', '温馨提示', {
          type: 'warning'

        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          this.getRolesList()
        }
      } catch (e) {
        this.$message('取消删除')
      }
    },
    // 获取全部权限
    async showCation (row) {
      console.log(row)
      this.roleId = row.id
      this.addCation = true
      const { data, meta } = await this.$axios.get('rights/tree')
      console.log(meta)

      if (meta.status === 200) {
        this.data = data
        console.log(data)
        const arr = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              arr.push(l3.id)
            })
          })
        })
        this.$refs.lis.setCheckedKeys(arr)
      }
    },
    // 分配权限
    async allocation () {
      const lid = this.$refs.lis.getCheckedKeys()
      const lsd = this.$refs.lis.getHalfCheckedKeys()
      const rids = [...lid, ...lsd].join(',')

      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      console.log(meta)

      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRolesList()
        this.addCation = false
      }
      // console.log(res)
    }

  }

}

</script>

<style lang="scss" scoped>
.roles{
  .add{
    margin-bottom: 10px
  }
  .l1{
    border-bottom: 1px dotted #ccc;
    margin-bottom: 5px
  }
  .l2{
    margin-bottom: 10px
  }
  .l3{
    margin-right: 10px
  }
}
</style>
