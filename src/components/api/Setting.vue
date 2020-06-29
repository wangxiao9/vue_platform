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
            <span>{{editConfigForm.name}}</span>
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
              <el-button>发布</el-button>
              <el-button type="primary">编辑</el-button>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
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
    openConfigDetail(row) {
      this.editConfigForm = row
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
