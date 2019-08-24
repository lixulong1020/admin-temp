<template>
  <div class="categories">
    <el-button type="success" @click="showAddDialog">添加分类</el-button>
<el-table
      row-key="cat_id"

 :data='categoryList'>
  <el-table-column
  prop="cat_name"
  label="分类名称"
  >

  </el-table-column>
  <el-table-column
  label="是否有效"
  >
  <template v-slot:default='{row}'>
{{row.cat_deleted?'否':"是"}}
  </template>

  </el-table-column>
  <el-table-column
  prop="cat_level"
  label="排序"
  >

  </el-table-column>
  <el-table-column
  label="操作"
  >
  <template v-slot:default="{row}">
<el-button type="primary" icon="el-icon-edit"  size="small" plain></el-button>
<el-button type="danger" icon="el-icon-delete" size="small" plain></el-button>
  </template>

  </el-table-column>
</el-table>
<!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
    @close='resetFields'
  title="添加分类"
  :visible.sync="dialogVisible"
  width="40%"
  >
  <el-form ref='form' :rules="rules" :model='form' label-width="80px">
<el-form-item label="分类名称" prop="cat_name">
<el-input placeholder="请输入分类名称" v-model="form.cat_name"></el-input>
</el-form-item>
<el-form-item label="父级名称" prop="options">
    <el-cascader
     clearable
    v-model="form.cat_pid"
    :options="options"
    :props="props"
    ></el-cascader>
</el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategori">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>

export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }

        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        }
      })
      // console.log(data)

      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    },
    async  showAddDialog () {
      this.dialogVisible = true
      const { data, meta } = await this.$axios.get('categories?type=2')
      console.log(data)

      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.errer(meta.msg)
      }
    },
    async addCategori () {
      try {
        // 先对表单进行校验
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          // 分类的父id，找最后一项 给默认值表示没有父级is
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          // 层级根据this.cat_pid的长度计算
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          // 提示
          this.$message.success(meta.msg)
          // 关闭提示框
          this.dialogVisible = false
          // 重新渲染

          this.getCategoryList()
        } else {
          this.$message.success(meta.msg)
        }

        // console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    resetFields () {
      this.$refs.form.resetFields()
    }

  }

}
</script>

<style>

</style>
