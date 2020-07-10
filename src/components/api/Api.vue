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
      editableTabsValue: ''
    }
  },
  created() {
    this.getProjectList()
  },
  computed: {
    ...mapState(['projectList'])
  },
  methods: {
    ...mapActions(['getProjectList'])
  }
}
</script>

<style lang="less" scoped>
</style>
