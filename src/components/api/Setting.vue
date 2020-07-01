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
          <el-button type="primary" @click="addDrawer=true">添加API配置</el-button>
        </el-col>
      </el-row>
      <!--主体-->
      <el-container>
        <el-aside style="width:500px">
          <el-table :data="configList" stripe @row-click="openConfigDetail">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="ConfigStatus" label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.ConfigStatus== false" type="danger">未发布</el-tag>
                <el-tag v-else type="success">发布</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main style="background:#fbfdfe">
          <el-row>
            <span style="font-weight:bold">{{editConfigForm.name}}</span>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div>| id</div>
              <div>{{editConfigForm.id}}</div>
            </el-col>
            <el-col :span="6">
              <div>| 请求方式</div>
              <div>{{editConfigForm.methods}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <div>| headers</div>
              <div>{{editConfigForm.header}}</div>
            </el-col>
            <el-col :span="6">
              <div>| url</div>
              <div>{{editConfigForm.url}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div>| 请求参数</div>
              <div>{{editConfigForm.param}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div>| 更新时间</div>
              <div>{{editConfigForm.update_time}}</div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col>
              <el-button @click="release">发布</el-button>
              <el-button type="primary" @click="edit">编辑</el-button>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-card>
    <!--新增详情页面-->
    <el-drawer :visible.sync="addDrawer">
      <div class="drawer_body">
        <el-form ref="saveConfigFormRef" :model="saveConfigForm" :rules="saveConfigFormRule">
          <el-form-item prop="name" label="| 配置名称">
            <el-input v-model="saveConfigForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-form-item prop="methods" label="| 请求方式"></el-form-item>
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
              :rows="5"
              placeholder="输入请求参数json格式"
            ></el-input>
          </el-form-item>
          <el-form-item prop="description" label="| 描述">
            <el-input v-model="saveConfigForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button @click="addDrawer=false">取消</el-button>
          <el-button @click="addSaveConfig">保存</el-button>
        </div>
      </div>
    </el-drawer>
    <!--打开详情页面-->
    <el-drawer :visible.sync="editDrawer">
      <div class="drawer_body">
        <el-form :model="editConfigForm" ref="editConfigFormRef">
          <el-form-item prop="name" label="| 配置名称">
            <el-input v-model="editConfigForm.name"></el-input>
          </el-form-item>
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
              :rows="5"
              placeholder="输入请求参数json格式"
            ></el-input>
          </el-form-item>
          <el-form-item prop="description" label="| 描述">
            <el-input v-model="editConfigForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button @click="editDrawer=false">取消</el-button>
          <el-button>保存</el-button>
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
      addDrawer: false,
      saveConfigForm: {
        name: '',
        methods: '',
        url: '',
        header: '',
        param: '',
        description: ''
      },
      saveConfigFormRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        methods: [
          { required: true, message: '请选择请求方式', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入url', trigger: 'blur' }],
        header: [{ message: '请输入header', trigger: 'blur' }],
        param: [{ required: true, message: '请输入参数', trigger: 'blur' }],
        description: [{ message: '请输入描述', trigger: 'blur' }]
      },
      editConfigForm: {}
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
      this.loading = true
    },
    openConfigDetail(row) {
      this.editConfigForm = row
    },
    addSaveConfig() {
      this.$refs.saveConfigFormRef.validate(async valid => {
        if (!valid) return
        await this.$http
          .post('addConfig', this.saveConfigForm)
          .then(res => {
            this.$message.success('添加配置成功')
            this.addDrawer = false
            this.$refs.saveConfigFormRef.resetFields()
            this.getConfigList()
          })
          .catch(error => {
            this.$message.error('添加配置失败')
            this.$refs.saveConfigFormRef.resetFields()
            console.log(error)
          })
      })
    },
    async release() {
      await this.$http
        .post('config/run/' + this.editConfigForm.id, {
          methods: this.editConfigForm.methods,
          url: this.editConfigForm.url,
          header: this.editConfigForm.header,
          param: this.editConfigForm.param
        })
        .then(res => {
          this.$message.success('发布成功')
          this.getConfigList()
        })
        .catch(error => {
          this.$message.error('发布失败')
          console.log(error)
        })
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    },
    edit() {
      console.log(this.editConfigForm)
      this.editDrawer = true
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
.el-container {
  margin-top: 20px;
}
.el-row {
  margin-top: 20px;
}
.el-col div {
  margin-top: 5px;
}
</style>
