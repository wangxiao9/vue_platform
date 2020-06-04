<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目类型</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert title="项目类型被项目引用后不可以删除" type="warning"></el-alert>
    <el-card>
      <!--搜索，添加项目类型-->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加项目类型</el-button>
        </el-col>
      </el-row>
      <!--body-->
      <!--table-->
      <el-table :data="typeList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="类型"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <i v-if="scope.row.typeStatus==false" class="el-icon-error"></i>
            <i v-else class="el-icon-success"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!--操作button-->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditTypeDialog(scope.row.id)"
            ></el-button>
            <el-button
              v-if="scope.row.typeStatus==false"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-button v-else type="danger" icon="el-icon-delete" size="mini" disabled></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--新增用户dialog对话框-->
    <el-dialog title="添加项目类型" :visible.sync="addDialogVisible" width="40%" @close="closeDialog">
      <el-form
        ref="addTypeFormRef"
        :rules="addTypeFormRule"
        :model="addTypeForm"
        label-width="100px"
      >
        <el-form-item prop="name" label="类型名称">
          <el-input v-model="addTypeForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="addTypeForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户dialog对话框-->
    <el-dialog title="编辑项目类型" :visible.sync="editDialogVisible" width="40%">
      <el-form
        ref="editTypeFormRef"
        :rules="editTypeFormRule"
        :model="editTypeForm"
        label-width="100px"
      >
        <el-form-item prop="name" label="类型名称">
          <el-input v-model="editTypeForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="editTypeForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 当前页数
        page: 1,
        // 每页显示多少条
        per_page: 10
      },
      typeList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addTypeForm: {
        name: '',
        description: ''
      },
      addTypeFormRule: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      },
      editTypeForm: {},
      editTypeFormRule: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    async getTypeList() {
      const { data: res } = await this.$http.post('types', this.queryInfo)
      this.typeList = res.types
      this.total = res._meta.total
    },
    addType() {
      this.$refs.addTypeFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('addtype', this.addTypeForm)
          .then(res => {
            this.$message.success('添加类型成功')
            this.addDialogVisible = false
            this.$refs.addTypeFormRef.resetFields()
            this.getTypeList()
          })
          .catch(error => {
            this.$message.error('添加类型失败')
            this.$refs.addTypeFormRef.resetFields()
            console.log(error)
          })
      })
    },
    editType() {
      this.$refs.editTypeFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .put('type/' + this.editTypeForm.id, {
            name: this.editTypeForm.name,
            description: this.editTypeForm.description
          })
          .then(res => {
            this.editDialogVisible = false
            this.getTypeList()
            this.$message.success('修改类型成功')
          })
          .catch(error => {
            this.editDialogVisible = false
            this.getTypeList()
            this.$message.error('修改类型失败')
            console.log(error)
          })
      })
    },
    async showEditTypeDialog(id) {
      this.editDialogVisible = true
      await this.$http
        .get(`type/${id}`)
        .then(res => (this.editTypeForm = res.data))
        .catch(error => {
          this.$message.error('获取type信息失败')
          console.log(error)
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.per_page = newSize
      this.getTypeList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getTypeList()
    },
    closeDialog() {
      this.$ref.addTypeFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
