<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>API管理</el-breadcrumb-item>
      <el-breadcrumb-item>API冒烟测试</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加API冒烟测试集</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;cursor: pointer;">
        <el-col>
          <span class="el-icon-circle-plus-outline" @click="addTestCase">新增测试用例</span>
        </el-col>
      </el-row>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        @tab-click="getTabId"
        @tab-remove="deleteCaseSet"
        closable
      >
        <el-tab-pane
          v-for="item in smokeProjectList"
          :key="item.id"
          :setId="item.id"
          :label="item.name"
        >
          <div>
            <el-button type="primary" style="float:right" @click="runcase(item.id)">运行</el-button>
            <el-table :data="smokeCaseList" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item>
                      <span class="title">接口地址:</span>
                      <span>{{ scope.row.url }}</span>
                    </el-form-item>
                    <el-form-item>
                      <span class="title">请求方式:</span>
                      <span>{{ scope.row.methods }}</span>
                    </el-form-item>
                    <el-form-item>
                      <span class="title">header:</span>
                      <span>{{ scope.row.header }}</span>
                    </el-form-item>
                    <el-form-item>
                      <span class="title">请求参数:</span>
                      <span>{{ scope.row.param }}</span>
                    </el-form-item>
                    <el-form-item>
                      <span class="title">描述:</span>
                      <span>{{ scope.row.description }}</span>
                    </el-form-item>
                    <el-form-item>
                      <span class="title">预期结果:</span>
                      <span>{{ scope.row.expect_res }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="case_no" label="测试编号"></el-table-column>
              <el-table-column prop="name" label="测试名称"></el-table-column>
              <el-table-column prop="api_res_status" label="测试结果">
                <template slot-scope="scope">
                  <i v-if="scope.row.api_res_status==false" class="el-icon-error"></i>
                  <i v-else class="el-icon-success"></i>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editCase(scope.row.id)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteCase(scope.row.id)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--新增测试集-->
    <el-dialog title="新增测试集" :visible.sync="addDialogVisible" width="40%">
      <el-form
        ref="addCaseSetFormRef"
        :rules="addCaseSetFormRule"
        :model="addCaseSetForm"
        label-width="100px"
      >
        <el-form-item prop="name" label="测试集">
          <el-input v-model="addCaseSetForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="project_id" label="所属项目">
          <el-select v-model="addCaseSetForm.project_id">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="config_id" label="关联全局变量">
          <el-select v-model="addCaseSetForm.config_id">
            <el-option
              v-for="item in configList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="addCaseSetForm.description"
            type="textarea"
            :rows="8"
            placeholder="输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCaseSet">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      queryInfo: {
        // 当前页数
        page: 1,
        // 每页显示多少条
        per_page: 10
      },
      editableTabsValue: '',
      smokeProjectList: [],
      smokeCaseList: [],
      addDialogVisible: false,
      addCaseSetForm: {
        name: '',
        project_id: 1,
        config_id: null,
        description: ''
      },
      addCaseSetFormRule: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        project_id: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      },
      set_id: null,
      totle: 0,
      case_total: 0,
      fullscreen: false
    }
  },
  created() {
    this.getSetList()
    this.getProjectList()
    this.getConfigList()
    this.getSmaokeCase(1)
  },
  computed: {
    ...mapState(['projectList', 'configList'])
  },
  methods: {
    ...mapActions(['getProjectList', 'getConfigList']),
    async getSetList() {
      const { data: res } = await this.$http.post('sets', this.queryInfo)
      console.log(res)
      this.smokeProjectList = res.api_case_sets
      this.total = res._meta.total
    },
    addTestCase() {
      this.$router.push('/api/add/case')
    },
    addCaseSet() {
      this.$refs.addCaseSetFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('addSet', this.addCaseSetForm)
          .then(res => {
            this.$message.success('添加测试集成功')
            this.addDialogVisible = false
            this.$refs.addCaseSetFormRef.resetFields()
            this.getSetList()
          })
          .catch(error => {
            this.$message.error('添加测试集失败')
            this.$refs.addCaseSetFormRef.resetFields()
            console.log(error)
          })
      })
    },
    /**
     * 根据切换不同tab获取对应的测试集的cases
     */
    getTabId(tag) {
      console.log(tag)
      this.getSmaokeCase(tag.$attrs.setId)
    },
    deleteCaseSet() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async valid => {
          await this.$http
            .delete('set/' + this.tag_id)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getSetList()
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
    /**
     * 获取不同的测试集对应的测试用例
     **/
    async getSmaokeCase(id) {
      const { data: res } = await this.$http.post(`set/${id}`, this.queryInfo)
      console.log(res)
      this.smokeCaseList = res.api_smoke_cases
      this.case_total = res._meta.total
    },
    /**
     * 编辑case,把caseid传出去
     */
    editCase(id) {
      this.$router.push({ path: '/api/edit/case', query: { id: id } })
    },
    openfullScreen() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    closefullScreen(loading) {
      loading.close()
    },
    // 运行case
    async runcase(id) {
      this.openfullScreen()
      await this.$http
        .post(`cases/run/${id}`)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            this.getSmaokeCase(id)
            this.closefullScreen(this.openfullScreen())
          }
          this.$message.success('运行冒烟测试用例成功')
        })
        .catch(error => {
          this.closefullScreen(this.openfullScreen())
          this.$message.error('添加测试集失败')
          console.log(error)
        })
    },
    // 删除case
    deleteCase(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async valid => {
          await this.$http
            .delete(`delete/case/${id}`)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getSmaokeCase(1)
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand .title {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-icon-success {
  color: #19e6a4;
}
</style>
