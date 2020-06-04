<template>
  <el-container class>
    <el-header>
      <span>测试开发平台</span>
      <el-button class="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/user">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>用户列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!--HOST管理-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>HOST管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/host">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>HOST配置</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!--项目管理-->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>项目管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/project/sort">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>项目类型</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/project/list">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>项目列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>API管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/api/setting">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>API配置</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/api/list">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>API列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    // 退出登录
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span {
    font-size: 20px;
    color: #ffffff;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
