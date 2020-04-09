<template>
  <div class="login_container">
    <!--定义一个登入盒子-->
    <div class="login_box">
      <!--头像-->
      <div class="logo_box">
        <img src="../assets/logo.png" />
      </div>
      <!--登录表单-->
      <div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" class="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="primary">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username:'',
        password:''
      },
      loginFormRule: {
        username: [
          {required:true, message:'请输入用户名', trigger:'blur'}
        ],
        password: [
          {required:true, message:'请输入密码', trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    // 重置
    resetForm() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background: #ffff;
  border: 1px solid;
  border-radius: 2%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .logo_box {
    height: 130px;
    width: 130px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.loginForm {
  position: absolute;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  bottom: 10px;
}

.btns {
  display: flex;
  justify-content: flex-end;  
}
</style>