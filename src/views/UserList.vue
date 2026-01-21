<template>
  <div class="page-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParam" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParam.username" placeholder="请输入用户名" clearable :prefix-icon="Search" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="queryParam.email" placeholder="请输入邮箱" clearable :prefix-icon="Message" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">用户列表</span>
          <el-button type="primary" :icon="Plus">新增用户</el-button>
        </div>
      </template>
      
      <el-table 
        :data="tableData" 
        style="width: 100%" 
        v-loading="loading" 
        stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="userType" label="用户类型" width="120" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.userType === 1 ? 'info' : 'primary'" effect="light">
              {{ scope.row.userType === 1 ? '门户用户' : '后台管理员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              disabled
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getUserList } from '../api';
import type { UserVo, UserQueryParam } from '../api/types';
import { Search, Refresh, Plus, Message } from '@element-plus/icons-vue';

const loading = ref(false);
const tableData = ref<UserVo[]>([]);
const queryParam = reactive<UserQueryParam>({
  username: '',
  email: ''
});

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getUserList({
      pageNum: pagination.current,
      pageSize: pagination.size,
      ...queryParam
    });
    tableData.value = res.records;
    pagination.total = res.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  fetchData();
};

const handleReset = () => {
  queryParam.username = '';
  queryParam.email = '';
  handleSearch();
};

const handleSizeChange = (val: number) => {
  pagination.size = val;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  pagination.current = val;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-card {
  border-radius: 8px;
  border: none;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 
              0 3px 6px 0 rgba(0, 0, 0, 0.06), 
              0 5px 12px 4px rgba(0, 0, 0, 0.04); 
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 18px;
}

.table-card {
  border-radius: 8px;
  border: none;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 
              0 3px 6px 0 rgba(0, 0, 0, 0.06), 
              0 5px 12px 4px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}
</style>
