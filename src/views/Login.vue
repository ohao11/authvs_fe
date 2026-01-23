<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-header">
          <h2 class="title">欢迎回来</h2>
          <p class="subtitle">请登录您的账户以继续</p>
        </div>
        
        <el-form :model="form" @submit.prevent="handleLogin" size="large" class="login-form">
          <div class="form-item-label">用户名</div>
          <el-form-item>
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名" 
              :prefix-icon="User"
              class="custom-input"
            />
          </el-form-item>
          
          <div class="form-item-label">密码</div>
          <el-form-item>
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              show-password 
              :prefix-icon="Lock"
              class="custom-input"
            />
          </el-form-item>
          
          <el-button 
            type="primary" 
            native-type="submit" 
            :loading="loading" 
            class="login-button"
          >
            登录
          </el-button>

          <div class="demo-account">
            <p class="demo-title">演示账户信息：</p>
            <p>用户名：admin</p>
            <p>密码：admin123</p>
          </div>
        </el-form>
      </div>
    </div>
    
    <div class="copyright">
      © 2026 后台管理系统. All rights reserved.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, getMe } from '../api';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const form = ref({
  username: '',
  password: ''
});
const loading = ref(false);

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码');
    return;
  }
  
  loading.value = true;
  try {
    const res = await login(form.value);
    localStorage.setItem('token', res.token);
    
    // 获取用户信息
    const user = await getMe();
    localStorage.setItem('userInfo', JSON.stringify(user));

    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1867c0 0%, #5c26cc 100%);
  position: relative;
  overflow: hidden;
}

.login-wrapper {
  z-index: 1;
}

.login-box {
  width: 400px;
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.login-header {
  margin-bottom: 30px;
  text-align: left;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.form-item-label {
  font-size: 14px;
  color: #4a4a4a;
  margin-bottom: 8px;
  font-weight: 500;
}

.custom-input {
  --el-input-hover-border-color: #409eff;
  --el-input-focus-border-color: #409eff;
}

:deep(.el-input__wrapper) {
  padding: 8px 15px;
  box-shadow: 0 0 0 1px #d9d9d9 inset;
  border-radius: 8px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 10px;
  background-color: #2563eb;
  border-color: #2563eb;
  font-weight: 600;
}

.login-button:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.demo-account {
  margin-top: 25px;
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #dbeafe;
}

.demo-account p {
  margin: 4px 0;
  font-size: 13px;
  color: #1e40af;
  font-family: monospace;
}

.demo-title {
  font-weight: 600;
  margin-bottom: 8px !important;
  color: #1e3a8a !important;
  font-family: inherit !important;
}

.copyright {
  position: absolute;
  bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-align: center;
  width: 100%;
}
</style>
