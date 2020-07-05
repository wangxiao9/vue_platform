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
          <el-button type="primary">添加API冒烟测试集</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;cursor: pointer;">
        <el-col>
          <span class="el-icon-circle-plus-outline" @click="addTestCase">新增测试用例</span>
        </el-col>
      </el-row>
      <el-tabs v-model="editableTabsValue" type="card">
        <el-tab-pane v-for="item in smokeProjectList" :key="item.id" :label="item.name">
          <div>
            <el-table></el-table>
          </div>
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
      editableTabsValue: '',
      smokeProjectList: []
    }
  },
  created() {
    this.getSetList()
  },
  // computed: {
  //   ...mapState(['projectList']),
  //   smokeProjectList: function() {
  //     return this.projectList.filter(item => {
  //       return item.type_id === 3
  //     })
  //   }
  // },
  methods: {
    ...mapActions(['getProjectList']),
    async getSetList() {
      const { data: res } = await this.$http.post('sets', this.queryInfo)
      console.log(res)
      this.smokeProjectList = res.api_case_sets
      this.total = res._meta.total
    },
    addTestCase() {
      this.$router.push('/api/add/case')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
