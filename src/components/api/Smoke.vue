<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>API管理</el-breadcrumb-item>
      <el-breadcrumb-item>API冒烟测试</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane v-for="item in smokeProjectList" :key="item.id" :label="item.name">
          <span>{{item.name}}</span>
        </el-tab-pane>
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
    this.getProjectList(this.queryInfo)
  },
  computed: {
    ...mapState(['projectList']),
    smokeProjectList: function() {
      return this.projectList.filter(item => {
        return item.type_id === 3
      })
    }
  },
  methods: {
    ...mapActions(['getProjectList'])
  }
}
</script>

<style lang="less" scoped>
</style>
