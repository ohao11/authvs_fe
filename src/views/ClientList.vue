<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">客户端列表</span>
          <el-button type="primary">新增客户端</el-button>
        </div>
      </template>
      <div class="placeholder-content">
        <el-empty description="客户端列表功能开发中..." />
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
