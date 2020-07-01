<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>HOST管理</el-breadcrumb-item>
      <el-breadcrumb-item>HOST列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索，添加用户-->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchData" clearable @clear="getHostList">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加HOST</el-button>
        </el-col>
      </el-row>
      <!--主体-->
      <el-table
        :data="hostList"
        border
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="host" label="内容">
          <template slot-scope="scope">{{scope.row.host | hostFilter}}</template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <i v-if="scope.row.hostStatus==false" class="el-icon-error"></i>
            <i v-else class="el-icon-success"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditHostDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteHost(scope.row.id)"
            ></el-button>
            <el-button
              v-if="scope.row.hostStatus==true"
              type="info"
              size="mini"
              @click="changeStatus(scope.row.id,scope.row.hostStatus)"
            >禁用</el-button>
            <el-button
              v-else
              type="success"
              size="mini"
              @click="changeStatus(scope.row.id,scope.row.hostStatus)"
            >启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 5, 10]"
        :page-size="queryInfo.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--新增host dialog对话框-->
    <el-dialog title="配置HOST" :visible.sync="addDialogVisible" width="50%">
      <el-form
        ref="addHostFormRef"
        :model="addHostForm"
        :rules="addHostFormRules"
        label-width="100px"
      >
        <el-form-item prop="name" label="名称">
          <el-input v-model="addHostForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="host" label="内容">
          <el-input v-model="addHostForm.host" type="textarea" :rows="8" placeholder="输入host内容"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="addHostForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHost">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑host-->
    <el-dialog title="编辑HOST" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editHostFormRef"
        :model="editHostForm"
        :rules="editHostFormRules"
        label-width="100px"
      >
        <el-form-item prop="name" label="名称">
          <el-input v-model="editHostForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="host" label="内容">
          <el-input v-model="editHostForm.host" type="textarea" :rows="8" placeholder="输入host内容"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="editHostForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editHost">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'host',
  data() {
    return {
      // host parameters
      queryInfo: {
        page: 1,
        per_page: 10
      },
      // 存储host列表
      hostList: [],
      total: 0,
      searchData: '',
      addDialogVisible: false,
      editDialogVisible: false,
      addHostForm: {
        name: '',
        host: '',
        description: ''
      },
      addHostFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        host: [{ required: true, message: '请输入host内容', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      },
      editHostForm: {},
      editHostFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        host: [{ required: true, message: '请输入host内容', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      },
      loading: false
    }
  },
  // 自定义过滤器
  filters: {
    hostFilter(value) {
      if (!value) return ''
      if (value.length > 32) {
        return value.slice(0, 32) + '...'
      }
      return value
    }
  },
  created() {
    this.getHostList()
    this.loading = true
  },
  methods: {
    async getHostList() {
      const { data: res } = await this.$http.post('host', this.queryInfo)
      console.log(res)
      this.hostList = res.hosts
      this.total = res._meta.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.per_page = newSize
      this.getHostList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getHostList()
    },
    addHost() {
      this.$refs.addHostFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('addhost', this.addHostForm)
          .then(res => {
            this.$message.success('添加host成功')
            this.addDialogVisible = false
            this.$refs.addHostFormRef.resetFields()
            this.getHostList()
          })
          .catch(error => {
            this.$message.error('添加用户失败')
            this.$refs.addHostFormRef.resetFields()
            console.log(error)
          })
      })
    },
    async showEditHostDialog(id) {
      this.editDialogVisible = true
      await this.$http
        .get(`host/${id}`)
        .then(res => {
          this.editHostForm = res.data
        })
        .catch(error => {
          this.$message.error('获取host失败')
          console.log(error)
        })
    },
    editHost() {
      this.$refs.editHostFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .put('host/' + this.editHostForm.id, {
            name: this.editHostForm.name,
            host: this.editHostForm.host,
            description: this.editHostForm.description
          })
          .then(res => {
            this.editDialogVisible = false
            this.getHostList()
            this.$message.success('修改host 成功')
          })
          .catch(err => {
            this.editDialogVisible = false
            this.getHostList()
            this.$message.error('修改host 失败')
            console.log(err)
          })
      })
    },
    deleteHost(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async valid => {
          await this.$http
            .delete(`host/${id}`)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getHostList()
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
    changeStatus(id, hostStatus) {
      this.$confirm('确定修改当前host状态么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async valid => {
          await this.$http
            .put(`host/status/${id}`, { hostStatus: !hostStatus })
            .then(res => {
              this.$message({
                type: 'success',
                message: '修改状态成功!'
              })
              this.getHostList()
            })
            .catch(error => {
              this.$message.error('当前只能生效一个host,请先禁用其他host')
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },
    search() {
      if (this.searchData === '' || this.searchData === null) return
      const list = this.hostList.filter(item => {
        return item.name.match(this.searchData)
      })
      this.hostList = list
      this.total = list.length
    }
  }
}
</script>

<style lang="less" scoped>
</style>
