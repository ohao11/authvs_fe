<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
          <span>审计管理</span>
          <el-button type="warning" @click="handleArchive">归档旧日志</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParam" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryParam.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-input v-model="queryParam.operationType" placeholder="操作类型" clearable />
        </el-form-item>
        <el-form-item label="模块">
          <el-input v-model="queryParam.operationModule" placeholder="模块" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="操作人" />
        <el-table-column prop="operationModule" label="模块" />
        <el-table-column prop="operationType" label="类型" />
        <el-table-column prop="operationDesc" label="描述" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="createdAt" label="时间" width="180" />
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
import { getOperationLogs, archiveLogs } from '../api';
import type { OperationLogVo, OperationLogQueryParam } from '../api/types';
import { ElMessage, ElMessageBox } from 'element-plus';

const loading = ref(false);
const tableData = ref<OperationLogVo[]>([]);
const queryParam = reactive<OperationLogQueryParam>({
  username: '',
  operationType: '',
  operationModule: ''
});

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getOperationLogs({
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

const handleArchive = () => {
  ElMessageBox.confirm(
    '确定要归档并删除超过6个月的日志吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const count = await archiveLogs();
        ElMessage.success(`归档成功，共处理 ${count} 条日志`);
        fetchData();
      } catch (e) {
        // error handled in request.ts
      }
    })
    .catch(() => {
      // cancel
    });
};

onMounted(() => {
  fetchData();
});
</script>
