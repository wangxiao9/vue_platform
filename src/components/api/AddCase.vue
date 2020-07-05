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
         <el-form>
              <el-form-item label="| 冒烟测试集">
                   <el-select>
                        <el-option></el-option>
                   </el-select>
              </el-form-item>
         </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/api/smoke')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
