<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索，添加用户-->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchData" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible =true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--table-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="nickname" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!--添加作用于插槽-->
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
              @change="userStatusChange(scope.row)"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="auth" label="角色">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.auth===1">管理员</el-tag>
            <el-tag v-else type="info">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!--操作button-->
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" content="编辑" placement="top" :enterable="false"> -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditUserDialog(scope.row.id)"
            ></el-button>
            <!-- <el-tooltip class="item" content="删除" placement="top" :enterable="false"> -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--用户页面，分页-->
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="closeDialog">
      <el-form
        ref="addUserFormRef"
        :rules="addUserFormRule"
        :model="addUserForm"
        label-width="100px"
      >
        <el-form-item prop="account" label="邮箱">
          <el-input v-model="addUserForm.account"></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="用户名">
          <el-input v-model="addUserForm.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑用户dialog对话框-->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="40%" @close="closeEditDialog">
      <el-form
        ref="editUserFormRef"
        :rules="editUserFormRule"
        :model="editUserForm"
        label-width="100px"
      >
        <el-form-item prop="account" label="邮箱">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="用户名">
          <el-input v-model="editUserForm.nickname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 获取用户列表参数对象
      queryInfo: {
        // 当前页数
        page: 1,
        // 每页显示多少条
        per_page: 5
      },
      // 用户列表
      userList: [],
      // 总共多少条用户
      total: 0,
      searchData: '',
      // 新增用户的dialog默认为false
      addDialogVisible: false,
      // 编辑用户dialog 默认为false
      editDialogVisible: false,
      // 添加用户规则
      addUserFormRule: {
        account: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 添加用户表单
      addUserForm: {
        account: '',
        nickname: '',
        password: ''
      },
      editUserFormRule: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      editUserForm: {}
    }
  },
  // 请求
  created () {
    this.getUsersList()
  },
  methods: {
    async getUsersList () {
      // 通过users 获取 用户列表
      const { data: res } = await this.$http.post('users', this.queryInfo)
      this.userList = res.users
      this.total = res._meta.total
    },
    // 监听每页个数事件
    handleSizeChange (newSize) {
      this.queryInfo.per_page = newSize
      this.getUsersList()
    },
    // 监听当前页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getUsersList()
    },
    // 搜索功能，如果没有搜索data ,就跳出
    search () {
      if (this.searchData === '' || this.searchData === null) return
      // 搜索
      const list = this.userList.filter(item => {
        return item.nickname.match(this.searchData)
      })
      this.userList = list
      this.total = list.length
    },
    // 关闭dialog后，重置dialog
    closeDialog () {
      this.$refs.addUserFormRef.resetFields()
    },
    closeEditDialog () {
      this.$refs.editUserFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('register', this.addUserForm)
          .then(res => {
            this.$message.success('添加用户成功')
            this.addDialogVisible = false
            this.$refs.addUserFormRef.resetFields()
          })
          .catch(error => {
            this.$message.error('添加用户失败')
            this.$refs.addUserFormRef.resetFields()
          })
      })
    },
    // 处理dialog 显示对应的内容
    async showEditUserDialog (id) {
      this.editDialogVisible = true
      await this.$http
        .get(`user/${id}`)
        .then(res => {
          this.editUserForm = res.data
        })
        .catch(error => {
          this.$message.error('获取用户信息失败')
        })
    },
    // 修改用户
    editUser () {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .put('user/' + this.editUserForm.id, {
            account: this.editUserForm.email,
            nickname: this.editUserForm.nickname
          })
          .then(res => {
            this.editDialogVisible = false
            this.getUsersList()
            this.$message.success('修改状态成功')
          })
          .catch(error => {
            this.editDialogVisible = false
            this.getUsersList()
            this.$message.error('修改状态失败')
          })
      })
    },
    // 修改用户状态，此方法暂时禁用，因为后端判断的时候delete用户无法登陆，token失效
    async userStatusChange (userinfo) {
      await this.$http
        .delete(`user/${userinfo.id}`)
        .then(res => {
          this.$message.success('修改状态成功')
        })
        .catch(error => {
          this.$message.error('修改状态失败')
        })
    },
    deleteUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async valid => {
          await this.$http
            .delete(`user/${id}`)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getUsersList()
            })
            .catch(error => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
