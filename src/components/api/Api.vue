<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>API管理</el-breadcrumb-item>
      <el-breadcrumb-item>API列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane v-for="item in projectList" :key="item.id" :label="item.name">{{item.name}}</el-tab-pane>
      </el-tabs>
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
      projectList: [],
      editableTabsValue: ''
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    async getProjectList() {
      const { data: res } = await this.$http.post('projects', this.queryInfo)
      this.projectList = res.projects
      this.editableTabsValue = res.projects[0].name
    }
  }
}
</script>

<style lang="less" scoped>
</style>
