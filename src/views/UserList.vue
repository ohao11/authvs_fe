<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParam" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryParam.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="queryParam.email" placeholder="邮箱" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="userType" label="用户类型">
          <template #default="scope">
            {{ scope.row.userType === 1 ? '门户用户' : '后台管理员' }}
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
              {{ scope.row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
      </el-table>

      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getUserList } from '../api';
import type { UserVo, UserQueryParam } from '../api/types';

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
