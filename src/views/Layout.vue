<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        router
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
      >
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/logs">
          <el-icon><Document /></el-icon>
          <span>审计管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px; display: flex; align-items: center; justify-content: flex-end; border-bottom: 1px solid #eee;">
        <el-dropdown>
          <span class="el-dropdown-link" style="cursor: pointer; display: flex; align-items: center;">
            管理员
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User, Document, ArrowDown } from '@element-plus/icons-vue';
import { logout } from '../api';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => route.path);

const handleLogout = async () => {
  try {
    await logout();
  } catch (e) {
    // Ignore error on logout
  }
  localStorage.removeItem('token');
  ElMessage.success('已退出');
  router.push('/login');
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
</style>
