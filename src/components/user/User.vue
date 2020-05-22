<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索，添加用户-->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--table-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="nickname" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!--添加作用于插槽-->
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
              @change="userStatusChange(scope.row)"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="auth" label="角色"></el-table-column>
        <el-table-column label="操作">
          <!--操作button-->
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" content="编辑" placement="top" :enterable="false"> -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- <el-tooltip class="item" content="删除" placement="top" :enterable="false"> -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--用户页面，分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表参数对象
      queryInfo: {
        // 当前页数
        page: 1,
        // 每页显示多少条
        per_page: 5
      },
      // 用户列表
      userList: [],
      // 总共多少条用户
      total: 0
    };
  },
  // 请求
  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      // 通过users 获取 用户列表
      const { data: res } = await this.$http.post("users", this.queryInfo);
      this.userList = res.users;
      this.total = res._meta.total;
    },
    // 监听每页个数事件
    handleSizeChange(newSize) {
      this.queryInfo.per_page = newSize;
      this.getUsersList();
    },
    // 监听当前页
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getUsersList();
    },
    // 修改用户状态，此方法暂时禁用，因为后端判断的时候delete用户无法登陆，token失效
    async userStatusChange(userinfo) {
      console.log(userinfo);
      await this.$http
        .delete(`user/${userinfo.id}`)
        .then(res => {
          this.$message.success("修改状态成功");
        })
        .catch(error => {
          this.$message.error("修改状态失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>