<template>
  <div>
    <!--面包屑-->
    <el-page-header @back="goBack"></el-page-header>
    <el-breadcrumb style="margin-top:20px">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>API管理</el-breadcrumb-item>
      <el-breadcrumb-item>API冒烟测试</el-breadcrumb-item>
      <el-breadcrumb-item>编辑测试用例</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="editCaseForm" ref="editCaseFormRef" :rules="editCaseFormRule">
        <el-row :gutter="15">
          <el-col :span="6" style="width:300px">
            <el-form-item prop="name" label="| 接口名称">
              <el-input v-model="editCaseForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="width:300px">
            <el-form-item prop="case_no" label="| 接口编号">
              <el-input v-model="editCaseForm.case_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-form-item prop="caseSet" label="| 冒烟测试集"></el-form-item>
              <el-select v-model="editCaseForm.case_set_id">
                <el-option
                  v-for="item in smokeProjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="width:300px">
            <el-form-item>
              <el-form-item prop="methods" label="| 请求方式"></el-form-item>
              <el-select v-model="editCaseForm.methods" style="width:100%">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="url" label="| 请求地址">
              <el-input v-model="editCaseForm.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="description" label="| 描述">
              <el-input v-model="editCaseForm.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-col :span="8">
                <el-form-item prop="dependent" label="| 依赖"></el-form-item>
                <!-- <el-input v-model="addCaseForm.dependent"></el-input> -->
                <el-radio-group v-model="editCaseForm.is_dependent">
                  <el-radio :label="false">无依赖</el-radio>
                  <el-radio :label="true">有依赖</el-radio>
                  <el-button
                    v-if="editCaseForm.is_dependent==true"
                    class="el-icon-circle-plus-outline"
                    @click="addDialogVisible = true"
                  >新增依赖值</el-button>
                </el-radio-group>
              </el-col>
              <el-col :span="12" v-if="editCaseForm.is_dependent==true">
                <el-table :data="dependentList" border>
                  <el-table-column prop="case_no" label="依赖case"></el-table-column>
                  <el-table-column prop="dependent_col" label="依赖key"></el-table-column>
                  <el-table-column prop="dependent_response_data" label="依赖表达式"></el-table-column>
                  <el-table-column label="操作">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item prop="header" label="| 请求headers">
              <el-input v-model="editCaseForm.header" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item prop="param" label="| 请求参数">
              <el-input
                v-model="editCaseForm.param"
                type="textarea"
                :rows="5"
                placeholder="输入请求参数json格式"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item prop="expect_res" label="| 预期结果">
              <el-input
                v-model="editCaseForm.expect_res"
                type="textarea"
                :rows="2"
                placeholder="输入请求参数json格式"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <div class="footer">
        <el-button type="info" @click="cancle">取消</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </el-card>
    <!--添加依赖布局-->
    <el-dialog title="添加依赖" :visible.sync="addDialogVisible" width="40%">
      <el-form
        ref="addDependentFormRef"
        :rules="addDependentFormRule"
        :model="addDependentForm"
        label-width="100px"
      >
        <el-form-item prop="dependent_case_no" label="case编码">
          <el-input v-model="addDependentForm.dependent_case_no"></el-input>
        </el-form-item>
        <el-form-item prop="dependent_key" label="依赖key">
          <el-input v-model="addDependentForm.dependent_key"></el-input>
        </el-form-item>
        <el-form-item prop="dependent_res" label="依赖表达式">
          <el-input v-model="addDependentForm.dependent_res"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDependent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { globalBus } from '../../globalBus'
export default {
  data() {
    return {
      queryInfo: {
        // 当前页数
        page: 1,
        // 每页显示多少条
        per_page: 10
      },
      smokeProjectList: [],
      editCaseForm: {},
      editCaseFormRule: {
        caseSet: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        case_no: [{ required: true, message: '请输入测试NO', trigger: 'blur' }],
        methods: [
          { required: true, message: '请选择请求方式', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入api', trigger: 'blur' }],
        header: [{ message: '请输入headers', trigger: 'blur' }],
        param: [{ message: '请输入参数值', trigger: 'blur' }],
        expect_res: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ]
      },
      caseid: null,
      addDialogVisible: false,
      addDependentForm: {
        dependent_case_no: '',
        dependent_key: '',
        dependent_res: ''
      },
      addDependentFormRule: {
        case_no: [
          { required: true, message: '请输测试用例编码', trigger: 'blur' }
        ],
        dependent_key: [
          { required: true, message: '请输入key值', trigger: 'blur' }
        ],
        dependent_res: [
          { required: true, message: '请输依赖表但是', trigger: 'blur' }
        ]
      },
      dependentList: []
    }
  },
  created() {
    // globalBus.$on('caseid', data => {
    //   this.getSmokeCaseDetail(data)
    // })
    this.getSmokeCaseDetail()
    this.getSetList()
  },
  methods: {
    goBack() {
      this.$router.push('/api/smoke')
    },
    cancle() {
      this.$refs.editCaseFormRef.resetFields()
      this.$router.push('/api/smoke')
    },
    async getSetList() {
      const { data: res } = await this.$http.post('sets', this.queryInfo)
      this.smokeProjectList = res.api_case_sets
      this.total = res._meta.total
    },
    /**
     * 1. 通过路由获取caseid
     * 2. 获取当前case详情
     */
    async getSmokeCaseDetail() {
      const id = this.$route.query.id
      console.log(id)
      await this.$http
        .get('case/' + id)
        .then(res => {
          this.editCaseForm = res.data
          if (this.editCaseForm.is_dependent === true) {
            this.getDependentCase(id)
          }
        })
        .catch(error => {
          this.$message.error('获取测试用例详情失败')
          console.log(error)
        })
    },
    async getDependentCase(id) {
      await this.$http
        .get('case/dependent/get/' + id)
        .then(res => {
          this.dependentList = res.data.dependentcases
          console.log(res.data)
        })
        .catch(error => {
          this.$message.error('获取依赖值失败')
          console.log(error)
        })
    },
    addDependent() {
      const id = this.$route.query.id
      this.$refs.addDependentFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('case/dependent/' + id, this.addDependentForm)
          .then(res => {
            this.$message.success('添加依赖成功')
            this.addDialogVisible = false
            this.$refs.addDependentFormRef.resetFields()
            this.getDependentCase(id)
          })
          .catch(error => {
            this.$message.error('添加依赖失败')
            this.$refs.addDependentFormRef.resetFields()
            console.log(error)
          })
      })
    }
    // addSmokeCase() {
    //   this.$refs.addCaseFormRef.validate(async valid => {
    //     if (!valid) return
    //     await this.$http
    //       .post('add/case', this.addCaseForm)
    //       .then(res => {
    //         this.$message.success('添加接口测试用例成功')
    //         this.cancle()
    //       })
    //       .catch(error => {
    //         this.$message.error('添加接口测试用例失败')
    //         this.$refs.addCaseFormRef.resetFields()
    //         console.log(error)
    //       })
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.footer {
  float: right;
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
