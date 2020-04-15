<template>
  <div class="login_container">
    <transition name="el-zoom-in-center">
      <!--定义一个登入盒子-->
      <div class="login_box" v-if="show" key="box1">
        <!--头像-->
        <div class="logo_box">
          <img src="../assets/logo.png" />
        </div>
        <!--按钮过渡-->
        <div class="transition-check">
          <i @click="show = !show" class="el-icon-right"></i>
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
      <!--注册盒子-->
      <div class="login_box" v-else key="box2">
        <!--头像-->
        <div class="logo_box">
          <img src="../assets/logo.png" />
        </div>
        <!--按钮过渡-->
        <div class="transition-check">
          <i @click="show = !show" class="el-icon-right"></i>
        </div>
        <!--登录表单-->
        <div>
          <el-form
            ref="registerFormRef"
            :rules="registerFormRule"
            :model="registerForm"
            class="RegisterForm"
          >
            <el-form-item prop="account">
              <el-input v-model="registerForm.account" prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input v-model="registerForm.nickname" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="registerForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
            </el-form-item>
            <!--按钮-->
            <el-form-item class="btns">
              <el-button type="primary" @click="register">注册</el-button>
              <el-button type="info" @click="resetRegisterForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      show: true,
      registerForm: {
        account: "",
        nickname: "",
        password: ""
      },
      registerFormRule: {
        account: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 登录重置
    resetForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    // 注册重置
    resetRegisterForm() {
      this.$refs.registerFormRef.resetFields();
    },
    // 注册用户
    register() {
      /**
       * 1. 注册请求后台/register接口
       * 2. 验证error_code = 0 为成功
       * 3. 注册成功后，提示注册成功，并且跳转到登录页面
       */
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "register",
          this.registerForm
        );
        this.$refs.registerFormRef.resetFields();
        if (res.error_code !== 0) return this.$message.error("注册失败");
        // this.$message.success("注册成功");
        this._data.show = true;
      });
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

.RegisterForm {
  position: absolute;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  bottom: -18px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.transition-check {
  margin: 50px 20px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}
</style>