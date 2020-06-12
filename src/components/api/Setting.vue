<template>
  <div>this is api</div>
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
      }
    }
  },
  created() {
    this.$store.dispatch('getProjectList', this.queryInfo)
  }
}
</script>

<style lang="less" scoped>
</style>
