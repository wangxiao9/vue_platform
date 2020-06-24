<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>API管理</el-breadcrumb-item>
      <el-breadcrumb-item>API全局配置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加API配置</el-button>
        </el-col>
      </el-row>
      <!--主体-->
      <el-table :data="configList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="ConfigStatus" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="mini"
              @click="addConfig(scope.row.id,scope.row.name)"
              icon="el-icon-plus"
            ></el-button>
            <el-button
              @click="openConfigDetail(scope.row.id, scope.row.name)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button size="mini" icon="el-icon-video-pause" type="warning"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--新增详情页面-->
    <el-drawer :title="configDetailTitle" :visible.sync="adddrawer" :before-close="handleClose">
      <div class="drawer_body">
        <el-form :model="saveConfigForm">
          <el-form-item>
            <el-form-item label="| 请求方式"></el-form-item>
            <el-select v-model="saveConfigForm.methods" style="width:100%">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="url" label="| 请求地址">
            <el-input v-model="saveConfigForm.url"></el-input>
          </el-form-item>
          <el-form-item prop="header" label="| 请求headers">
            <el-input v-model="saveConfigForm.header"></el-input>
          </el-form-item>
          <el-form-item prop="param" label="| 请求参数">
            <el-input
              v-model="saveConfigForm.param"
              type="textarea"
              :rows="8"
              placeholder="输入请求参数json格式"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="drawer__footer">
          <el-button>取消</el-button>
          <el-button>保存</el-button>
        </div>
      </div>
    </el-drawer>
    <!--打开详情页面-->
    <el-drawer :title="configDetailTitle" :visible.sync="editDrawer" :before-close="editHandleClose">
      <div class="drawer_body">
        <el-form :model="editConfigForm" ref="editConfigFormRef">
          <el-form-item>
            <el-form-item label="| 请求方式"></el-form-item>
            <el-select v-model="editConfigForm.methods" style="width:100%">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="url" label="| 请求地址">
            <el-input v-model="editConfigForm.url"></el-input>
          </el-form-item>
          <el-form-item prop="header" label="| 请求headers">
            <el-input v-model="editConfigForm.header"></el-input>
          </el-form-item>
          <el-form-item prop="param" label="| 请求参数">
            <el-input
              v-model="editConfigForm.param"
              type="textarea"
              :rows="8"
              placeholder="输入请求参数json格式"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="drawer__footer">
          <el-button>取消</el-button>
          <el-button type="primary">运行</el-button>
        </div>
      </div>
    </el-drawer>
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
      configList: [],
      total: 0,
      editDrawer: false,
      adddrawer: false,
      saveConfigForm: {
        methods: '',
        url: '',
        header: '',
        param: ''
      },
      editConfigForm: {},
      configDetailTitle: ''
    }
  },
  created() {
    this.getConfigList()
  },
  methods: {
    async getConfigList() {
      const { data: res } = await this.$http.post('configs', this.queryInfo)
      this.configList = res.api_config
      this.total = res._meta.total
    },
    // 处理左侧详情框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    editHandleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs.editConfigFormRef.resetFields()
          this.editDrawer = false
        })
        .catch(_ => {})
    },
    openConfigDetail(id, name) {
      this.editDrawer = true
      this.configDetailTitle = name
      console.log(this)
      this.getConfigDetail(id)
    },
    async getConfigDetail(id) {
      await this.$http
        .get(`config/detail/${id}`)
        .then(res => {
          this.editConfigForm = res.data
          console.log(res.data)
        })
        .catch(error => {
          this.$message.error('获取配置详情失败')
          console.log(error)
        })
    },
    async addConfig(id, name) {
      this.adddrawer = true
      this.configDetailTitle = name
    }
  }
}
</script>

<style lang="less" scoped>
.drawer_body {
  margin: 20px 20px;
}
.drawer__footer {
  right: 10px;
  bottom: 10px;
  position: absolute;
}
.el-form-item {
  font-weight: bold;
}
</style>
