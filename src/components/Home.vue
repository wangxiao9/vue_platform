<template>
  <div>
    <el-button class="primary" plain @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {},
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>
<style lang="less" scoped>
</style>