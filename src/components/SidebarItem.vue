<template>
  <div v-if="!item.children || item.children.length === 0">
    <el-menu-item :index="item.path">
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <el-icon v-else><MenuIcon /></el-icon>
      <span>{{ item.name }}</span>
    </el-menu-item>
  </div>
  <el-sub-menu v-else :index="item.path">
    <template #title>
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <el-icon v-else><MenuIcon /></el-icon>
      <span>{{ item.name }}</span>
    </template>
    <sidebar-item
      v-for="child in item.children"
      :key="child.id"
      :item="child"
    />
  </el-sub-menu>
</template>

<script setup lang="ts">
import { Menu as MenuIcon } from '@element-plus/icons-vue';
import type { MenuVo } from '../api/types';

// Extend MenuVo to include optional icon for frontend mapping
interface MenuItem extends MenuVo {
  icon?: any;
}

defineProps<{
  item: MenuItem;
}>();
</script>
