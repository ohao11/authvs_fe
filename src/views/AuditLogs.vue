<template>
  <div class="page-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParam" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParam.username" placeholder="请输入用户名" clearable :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="queryParam.operationType" placeholder="请选择类型" clearable style="width: 180px">
            <el-option label="登录" value="LOGIN" />
            <el-option label="查询" value="QUERY" />
            <el-option label="新增" value="CREATE" />
            <el-option label="修改" value="UPDATE" />
            <el-option label="删除" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块">
          <el-input v-model="queryParam.operationModule" placeholder="请输入模块" clearable :prefix-icon="Menu" />
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
          <span class="header-title">审计日志</span>
          <el-button type="warning" @click="handleArchive" :icon="Delete">归档旧日志</el-button>
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
        <el-table-column prop="username" label="操作人" width="120" />
        <el-table-column prop="operationModule" label="模块" width="120" />
        <el-table-column prop="operationType" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getOperationTypeTag(scope.row.operationType)" effect="plain">
              {{ scope.row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationDesc" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger'" effect="dark" size="small">
              {{ scope.row.status === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="操作时间" width="180" />
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
import { getOperationLogs, archiveLogs } from '../api';
import type { OperationLogVo, OperationLogQueryParam } from '../api/types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Delete, User, Menu } from '@element-plus/icons-vue';

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

const getOperationTypeTag = (type: string) => {
  const map: Record<string, string> = {
    LOGIN: 'info',
    QUERY: '',
    CREATE: 'success',
    UPDATE: 'warning',
    DELETE: 'danger'
  };
  return map[type] || 'info';
};

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

const handleReset = () => {
  queryParam.username = '';
  queryParam.operationType = '';
  queryParam.operationModule = '';
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
