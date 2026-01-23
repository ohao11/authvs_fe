<template>
  <el-container class="layout-container">
    <el-aside width="240px" class="layout-aside">
      <div class="logo-container">
        <el-icon class="logo-icon" :size="32" color="#fff"><ElementPlus /></el-icon>
        <h1 class="system-title">后台管理系统</h1>
      </div>
      <el-menu
        router
        :default-active="activeMenu"
        class="el-menu-vertical"
        background-color="#001529"
        text-color="rgba(255, 255, 255, 0.65)"
        active-text-color="#fff"
      >
        <sidebar-item v-for="menu in menuList" :key="menu.id" :item="menu" />
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <!-- 可以在这里加面包屑或折叠按钮 -->
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-dropdown">
              <el-avatar :size="32" class="user-avatar">A</el-avatar>
              <span class="username">{{ username }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, markRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User, Document, ArrowDown, ElementPlus, Key, Setting } from '@element-plus/icons-vue';
import { logout, getUserMenus } from '../api';
import type { MenuVo } from '../api/types';
import { ElMessage } from 'element-plus';
import SidebarItem from '../components/SidebarItem.vue';

const route = useRoute();
const router = useRouter();

const username = ref('管理员');

const activeMenu = computed(() => route.path);

// Extend MenuVo to include optional icon for frontend mapping
interface MenuItem extends MenuVo {
  icon?: any;
}

const menuList = ref<MenuItem[]>([]);

const iconMap: Record<string, any> = {
  '/admin/users': markRaw(User),
  '/admin/audit': markRaw(Document),
  '/admin/auth': markRaw(Key),
  '/admin/settings': markRaw(Setting),
};

const fetchMenus = async () => {
  try {
    const res = await getUserMenus();
    // Map icons to the menu items recursively
    const mapIcons = (items: MenuVo[]): MenuItem[] => {
      return items.map(item => {
        const newItem: MenuItem = { ...item };
        // Try to match icon by path, or use default
        if (iconMap[item.path]) {
          newItem.icon = iconMap[item.path];
        } else {
           // Default icon or specific logic
           // newItem.icon = markRaw(MenuIcon);
        }
        
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = mapIcons(newItem.children);
        }
        return newItem;
      });
    };
    
    menuList.value = mapIcons(res);
  } catch (error) {
    console.error('Failed to fetch menus', error);
  }
};

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

onMounted(() => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo && userInfo.username) {
        username.value = userInfo.username;
      }
    } catch (e) {
      console.error('Failed to parse user info', e);
    }
  }
  fetchMenus();
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #001529;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.logo-container {
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #002140;
  overflow: hidden;
}

.logo-icon {
  margin-right: 12px;
}

.system-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

.el-menu-vertical {
  border-right: none;
}

:deep(.el-menu-item) {
  margin: 4px 8px;
  border-radius: 4px;
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff !important;
}

:deep(.el-menu-item:hover) {
  color: #fff !important;
}

.layout-header {
  background: #fff;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.65);
  transition: all 0.3s;
  padding: 0 12px;
  border-radius: 4px;
  height: 48px;
  outline: none;
}

.user-dropdown:hover {
  background: rgba(0, 0, 0, 0.025);
}

.user-avatar {
  background-color: #1890ff;
  margin-right: 8px;
}

.username {
  font-size: 14px;
  margin-right: 4px;
  font-weight: 500;
}

.layout-main {
  background-color: #f0f2f5;
  padding: 24px;
}

/* Transition animation */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
