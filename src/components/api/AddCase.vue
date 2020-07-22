<template>
  <div>
    <!--面包屑-->
    <el-page-header @back="goBack"></el-page-header>
    <el-breadcrumb style="margin-top:20px">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>API管理</el-breadcrumb-item>
      <el-breadcrumb-item>API冒烟测试</el-breadcrumb-item>
      <el-breadcrumb-item>新增测试用例</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="addCaseForm" ref="addCaseFormRef" :rules="addCaseFormRule">
        <el-row :gutter="15">
          <el-col :span="6" style="width:300px">
            <el-form-item prop="name" label="| 接口名称">
              <el-input v-model="addCaseForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="width:300px">
            <el-form-item prop="case_no" label="| 接口编号">
              <el-input v-model="addCaseForm.case_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-form-item prop="caseSet" label="| 冒烟测试集"></el-form-item>
              <el-select v-model="addCaseForm.caseSet">
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
              <el-select v-model="addCaseForm.methods" style="width:100%">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="url" label="| 请求地址">
              <el-input v-model="addCaseForm.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="description" label="| 描述">
              <el-input v-model="addCaseForm.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-col :span="8">
                <el-form-item prop="dependent" label="| 依赖"></el-form-item>
                <!-- <el-input v-model="addCaseForm.dependent"></el-input> -->
                <el-radio-group v-model="addCaseForm.dependent">
                  <el-radio :label="false">无依赖</el-radio>
                  <el-radio :label="true" disabled>有依赖</el-radio>
                  <el-button
                    v-if="addCaseForm.dependent==true"
                    class="el-icon-circle-plus-outline"
                  >新增依赖值</el-button>
                </el-radio-group>
              </el-col>
              <el-col :span="10" v-if="addCaseForm.dependent==true">
                <el-input :disabled="true" label="惺惺惜惺惺">ssssss</el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item prop="header" label="| 请求headers">
              <el-input v-model="addCaseForm.header" type="textarea" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item prop="param" label="| 请求参数">
              <el-input
                v-model="addCaseForm.param"
                type="textarea"
                :rows="5"
                placeholder="输入请求参数json格式"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item prop="expect_res" label="| 预期结果">
              <el-input
                v-model="addCaseForm.expect_res"
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
        <el-button type="primary" @click="addSmokeCase">保存</el-button>
      </div>
    </el-card>
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
      smokeProjectList: [],
      addCaseForm: {
        name: '',
        case_no: '',
        caseSet: null,
        methods: '',
        url: '',
        description: '',
        dependent: false,
        header: '',
        param: '',
        expect_res: ''
      },
      addCaseFormRule: {
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
      }
    }
  },
  created() {
    this.getSetList()
  },
  methods: {
    goBack() {
      this.$router.push('/api/smoke')
    },
    cancle() {
      this.$refs.addCaseFormRef.resetFields()
      this.$router.push('/api/smoke')
    },
    async getSetList() {
      const { data: res } = await this.$http.post('sets', this.queryInfo)
      console.log(res)
      this.smokeProjectList = res.api_case_sets
      this.total = res._meta.total
    },
    addSmokeCase() {
      this.$refs.addCaseFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('add/case', this.addCaseForm)
          .then(res => {
            this.$message.success('添加接口测试用例成功')
            this.cancle()
          })
          .catch(error => {
            this.$message.error('添加接口测试用例失败')
            this.$refs.addCaseFormRef.resetFields()
            console.log(error)
          })
      })
    }
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
