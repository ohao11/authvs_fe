<template>
  <div class="page-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="queryParam" class="search-form">
        <el-form-item label="客户端名称">
          <el-input v-model="queryParam.clientName" placeholder="请输入客户端名称" clearable :prefix-icon="Search" />
        </el-form-item>
        <el-form-item label="Client ID">
          <el-input v-model="queryParam.clientId" placeholder="请输入Client ID" clearable :prefix-icon="Key" />
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
          <span class="header-title">客户端列表</span>
          <el-button type="primary" @click="handleAdd" :icon="Plus">新增客户端</el-button>
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
        <el-table-column prop="clientName" label="名称" min-width="120" />
        <el-table-column prop="clientTypeDesc" label="客户端类型" width="120" />
        <el-table-column prop="clientId" label="Client ID" min-width="180" />
        <el-table-column label="授权类型" min-width="150">
          <template #default="scope">
            <el-tag v-for="type in scope.row.grantTypes" :key="type" size="small" class="grant-tag">
              {{ type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              disabled
              :active-value="true"
              :inactive-value="false"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleResetSecret(scope.row)">重置密钥</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="客户端名称" prop="clientName">
          <el-input v-model="formData.clientName" placeholder="请输入客户端名称" />
        </el-form-item>
        <el-form-item label="客户端类型" prop="clientType">
          <el-select v-model="formData.clientType" placeholder="请选择客户端类型" style="width: 100%">
            <el-option v-for="item in clientTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="授权类型" prop="grantTypes">
          <el-select v-model="formData.grantTypes" multiple placeholder="请选择授权类型" style="width: 100%">
            <el-option label="authorization_code" value="authorization_code" />
            <el-option label="client_credentials" value="client_credentials" />
            <el-option label="refresh_token" value="refresh_token" />
            <el-option label="password" value="password" />
            <el-option label="implicit" value="implicit" />
          </el-select>
        </el-form-item>
        <el-form-item label="回调地址" prop="redirectUris">
          <el-input 
            v-model="formData.redirectUris" 
            type="textarea" 
            :rows="2" 
            placeholder="请输入回调地址，多个地址用逗号分隔" 
          />
        </el-form-item>
        <el-form-item label="权限范围" prop="scopes">
          <el-input v-model="formData.scopes" placeholder="请输入权限范围，如 openid,profile" />
        </el-form-item>
        <el-form-item label="Token有效期" prop="accessTokenValidity">
          <el-input-number v-model="formData.accessTokenValidity" :min="60" label="秒" />
          <span class="unit-text">秒</span>
        </el-form-item>
        <el-form-item label="RefreshToken有效期" prop="refreshTokenValidity">
          <el-input-number v-model="formData.refreshTokenValidity" :min="60" label="秒" />
          <span class="unit-text">秒</span>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入描述信息" />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Secret Display Dialog -->
    <el-dialog
      v-model="secretDialogVisible"
      title="客户端凭证"
      width="500px"
    >
      <div class="secret-info">
        <el-alert
          title="请务必保存好 Client Secret，它只会在此时显示一次！"
          type="warning"
          show-icon
          :closable="false"
          class="secret-alert"
        />
        <div class="info-item">
          <span class="label">Client ID:</span>
          <span class="value">{{ currentSecret?.clientId }}</span>
          <el-button link type="primary" size="small" @click="copyToClipboard(currentSecret?.clientId || '')">复制</el-button>
        </div>
        <div class="info-item">
          <span class="label">Client Secret:</span>
          <span class="value">{{ currentSecret?.clientSecret }}</span>
          <el-button link type="primary" size="small" @click="copyToClipboard(currentSecret?.clientSecret || '')">复制</el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="secretDialogVisible = false">我已保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { getClientList, createClient, updateClient, deleteClient, resetClientSecret, getClientDetail } from '../api';
import type { ClientVo, ClientQueryParam, ClientSaveParam, ClientSecretVo } from '../api/types';
import { Search, Refresh, Plus, Key } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';

const loading = ref(false);
const tableData = ref<ClientVo[]>([]);
const queryParam = reactive<ClientQueryParam>({
  clientName: '',
  clientId: ''
});

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// Dialog related
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref<FormInstance>();

const clientTypeOptions = [
  { label: 'Web应用', value: 1 },
  { label: '移动应用', value: 2 },
  { label: '单页应用', value: 3 },
  { label: '服务端应用', value: 4 }
];

// Form interface for UI binding
interface ClientForm {
  id?: number;
  clientName: string;
  clientType: number | undefined;
  grantTypes: string[];
  redirectUris: string;
  scopes: string;
  accessTokenValidity: number;
  refreshTokenValidity: number;
  description: string;
  enabled: boolean;
}

const formData = reactive<ClientForm>({
  clientName: '',
  clientType: undefined,
  grantTypes: [],
  redirectUris: '',
  scopes: 'openid,profile',
  accessTokenValidity: 3600,
  refreshTokenValidity: 7200,
  description: '',
  enabled: true
});

const rules = reactive<FormRules>({
  clientName: [{ required: true, message: '请输入客户端名称', trigger: 'blur' }],
  clientType: [{ required: true, message: '请选择客户端类型', trigger: 'change' }],
  grantTypes: [{ required: true, message: '请选择授权类型', trigger: 'change' }],
  redirectUris: [{ required: true, message: '请输入回调地址', trigger: 'blur' }],
  scopes: [{ required: true, message: '请输入权限范围', trigger: 'blur' }],
});

// Secret Display
const secretDialogVisible = ref(false);
interface SecretDisplayVo {
  clientId: string;
  clientSecret: string;
}
const currentSecret = ref<SecretDisplayVo | null>(null);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getClientList({
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
  queryParam.clientName = '';
  queryParam.clientId = '';
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

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  formData.id = undefined;
  formData.clientName = '';
  formData.clientType = undefined;
  formData.grantTypes = [];
  formData.redirectUris = '';
  formData.scopes = 'openid,profile';
  formData.accessTokenValidity = 3600;
  formData.refreshTokenValidity = 7200;
  formData.description = '';
  formData.enabled = true;
};

const handleAdd = () => {
  resetForm();
  dialogTitle.value = '新增客户端';
  dialogVisible.value = true;
};

const handleEdit = async (row: ClientVo) => {
  resetForm();
  dialogTitle.value = '编辑客户端';
  
  try {
    const res = await getClientDetail(row.id);
    formData.id = res.id;
    formData.clientName = res.clientName;
    formData.clientType = res.clientType;
    formData.grantTypes = res.grantTypes ? [...res.grantTypes] : [];
    formData.redirectUris = res.redirectUris ? res.redirectUris.join(',') : '';
    formData.scopes = res.scopes ? res.scopes.join(',') : '';
    formData.accessTokenValidity = res.accessTokenValidity;
    formData.refreshTokenValidity = res.refreshTokenValidity;
    formData.description = res.description;
    formData.enabled = res.enabled;
    
    dialogVisible.value = true;
  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const params: ClientSaveParam = {
          ...formData,
          clientType: formData.clientType!,
          grantTypes: formData.grantTypes.join(',')
        };

        if (formData.id) {
          await updateClient(formData.id, params);
          ElMessage.success('更新成功');
        } else {
          const res = await createClient(params);
          ElMessage.success('创建成功');
          // 显示密钥
          if (res.clientSecret) {
             currentSecret.value = {
               clientId: res.clientId,
               clientSecret: res.clientSecret
             };
             secretDialogVisible.value = true;
          }
        }
        dialogVisible.value = false;
        fetchData();
      } catch (error) {
        // handled by interceptor
      }
    }
  });
};

const handleDelete = (row: ClientVo) => {
  ElMessageBox.confirm('确定要删除该客户端吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteClient(row.id);
      ElMessage.success('删除成功');
      fetchData();
    } catch (error) {
      // handled by interceptor
    }
  });
};

const handleResetSecret = (row: ClientVo) => {
  ElMessageBox.confirm('确定要重置该客户端的密钥吗？旧密钥将立即失效！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await resetClientSecret(row.id);
      currentSecret.value = {
        clientId: res.clientId,
        clientSecret: res.newClientSecret
      };
      secretDialogVisible.value = true;
      ElMessage.success('重置成功');
    } catch (error) {
      // handled by interceptor
    }
  });
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功');
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

.search-card, .table-card {
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

.grant-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.unit-text {
  margin-left: 10px;
  color: #606266;
}

.secret-alert {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.info-item .label {
  width: 100px;
  font-weight: 600;
  color: #606266;
}

.info-item .value {
  flex: 1;
  font-family: monospace;
  color: #303133;
  word-break: break-all;
}
</style>

