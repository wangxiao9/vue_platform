<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索，添加项目列表-->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">新增项目</el-button>
        </el-col>
      </el-row>
      <el-table :data="projectList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="type_name" label="类型"></el-table-column>
        <el-table-column prop="version" label="项目版本"></el-table-column>
        <el-table-column prop="update_time" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <!--操作button-->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteProject(scope.row.id)"
            ></el-button>
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
    <el-dialog title="添加项目" :visible.sync="addDialogVisible" width="40%" @close="closeAddDialog">
      <el-form
        ref="addProjectFormRef"
        :rules="addProjectFormRule"
        :model="addProjectForm"
        label-width="100px"
      >
        <el-form-item prop="name" label="项目名称">
          <el-input v-model="addProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-select v-model="addProjectForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="version" label="版本号">
          <el-input v-model="addProjectForm.version"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="addProjectForm.description"
            type="textarea"
            :rows="8"
            placeholder="输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑项目" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editProjectFormRef"
        :model="editProjectForm"
        :rules="editProjectFormRules"
        label-width="100px"
      >
        <el-form-item prop="name" label="项目名称">
          <el-input v-model="editProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="type_id" label="类型">
          <el-select v-model="editProjectForm.type_id" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="version" label="版本号">
          <el-input v-model="editProjectForm.version"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="editProjectForm.description"
            type="textarea"
            :rows="8"
            placeholder="输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProject">确 定</el-button>
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
      projectList: [],
      typeList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addProjectForm: {
        name: '',
        type: 1,
        version: '',
        description: ''
      },
      addProjectFormRule: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      },
      editProjectForm: {},
      editProjectFormRules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getProjectList()
    this.getTypeList()
  },
  methods: {
    async getProjectList() {
      const { data: res } = await this.$http.post('projects', this.queryInfo)
      this.projectList = res.projects
      this.total = res._meta.total
    },
    async getTypeList() {
      const { data: res } = await this.$http.post('types', this.queryInfo)
      this.typeList = res.types
    },
    addProject() {
      this.$refs.addProjectFormRef.validate(async valid => {
        await this.$http
          .post('project', this.addProjectForm)
          .then(res => {
            this.$message.success('添加项目成功')
            this.addDialogVisible = false
            this.$refs.addProjectFormRef.resetFields()
            this.getProjectList()
          })
          .catch(error => {
            this.$message.error('添加项目失败')
            this.$refs.addProjectFormRef.resetFields()
            console.log(error)
          })
      })
    },
    closeAddDialog() {
      this.$refs.addProjectFormRef.resetFields()
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      await this.$http
        .get(`project/${id}`)
        .then(res => {
          this.editProjectForm = res.data
          console.log(this.editProjectForm)
        })
        .catch(error => {
          this.$message.error('获取项目失败')
          console.log(error)
        })
    },
    editProject() {
      this.$refs.editProjectFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .put('project/' + this.editProjectForm.id, {
            name: this.editProjectForm.name,
            version: this.editProjectForm.version,
            type: this.editProjectForm.type_id,
            description: this.editProjectForm.description
          })
          .then(res => {
            this.editDialogVisible = false
            this.getProjectList()
            this.$message.success('修改项目成功')
          })
          .catch(error => {
            this.editDialogVisible = false
            this.getProjectList()
            this.$message.error('修改项目失败')
            console.log(error)
          })
      })
    },
    deleteProject(id) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async valid => {
          await this.$http
            .delete(`project/${id}`)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getProjectList()
            })
            .catch(error => {
              this.$message.error('删除失败')
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.per_page = newSize
      this.getProjectList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getProjectList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
