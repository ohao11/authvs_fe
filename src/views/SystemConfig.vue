<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">基础配置</span>
          <el-button type="primary">保存配置</el-button>
        </div>
      </template>
      <div class="placeholder-content">
        <el-empty description="系统基础配置功能开发中..." />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-container {
  padding: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 16px;
  font-weight: 600;
}
</style>
