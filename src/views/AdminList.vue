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
        <el-form-item label="状态">
          <el-select v-model="queryParam.enabled" placeholder="全部" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
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
          <span class="header-title">管理员列表</span>
          <el-button type="primary" @click="handleAdd" :icon="Plus">新增管理员</el-button>
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
        <el-table-column label="角色" min-width="150">
          <template #default="scope">
            <el-tag 
              v-for="role in scope.row.roles" 
              :key="role.id" 
              size="small" 
              class="role-tag"
            >
              {{ role.roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              disabled
              :active-value="1"
              :inactive-value="0"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="scope">
            <el-button 
              link 
              type="primary" 
              size="small" 
              @click="handleEdit(scope.row)"
              :disabled="isSuperAdmin(scope.row)"
            >
              编辑
            </el-button>
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
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="formData.username" 
            placeholder="请输入用户名" 
            :disabled="!!formData.id"
          />
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="password" 
        >
          <el-input 
            v-model="formData.password" 
            type="password" 
            :placeholder="formData.id ? '留空则不修改密码' : '请输入密码'" 
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select 
            v-model="formData.roleIds" 
            multiple 
            placeholder="请选择角色" 
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { getAdminList, createAdmin, updateAdmin, getAdminRoles } from '../api';
import type { AdminVo, AdminQueryParam, AdminCreateParam, AdminUpdateParam, RoleListVo } from '../api/types';
import { Search, Refresh, Plus, Message } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const loading = ref(false);
const tableData = ref<AdminVo[]>([]);
const roleList = ref<RoleListVo[]>([]);
const queryParam = reactive<AdminQueryParam>({
  username: '',
  email: ''
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

// Unified form data interface
interface AdminFormData {
  id?: number;
  username: string;
  password?: string;
  email: string;
  phone: string;
  roleIds: number[];
  enabled: boolean;
}

const formData = reactive<AdminFormData>({
  username: '',
  password: '',
  email: '',
  phone: '',
  roleIds: [], // Default empty roles, can be extended later
  enabled: true
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { 
      validator: (rule: any, value: string, callback: any) => {
        if (!formData.id && !value) {
          callback(new Error('请输入密码'));
        } else if (value && (value.length < 6 || value.length > 20)) {
          callback(new Error('长度在 6 到 20 个字符'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
});

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getAdminList({
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

const fetchRoles = async () => {
  try {
    const res = await getAdminRoles();
    roleList.value = res;
  } catch (error) {
    console.error('Failed to fetch roles:', error);
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

const isSuperAdmin = (row: AdminVo) => {
  return row.roles && row.roles.some(role => role.roleCode === 'SUPER_ADMIN');
};

// CRUD Operations
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  formData.id = undefined;
  formData.username = '';
  formData.password = '';
  formData.email = '';
  formData.phone = '';
  formData.roleIds = [];
  formData.enabled = true;
};

const handleAdd = () => {
  resetForm();
  dialogTitle.value = '新增管理员';
  dialogVisible.value = true;
};

const handleEdit = (row: AdminVo) => {
  resetForm();
  dialogTitle.value = '编辑管理员';
  dialogVisible.value = true;
  
  nextTick(() => {
    formData.id = row.id;
    formData.username = row.username;
    formData.email = row.email;
    formData.phone = row.phone;
    formData.roleIds = row.roles ? row.roles.map(r => Number(r.id)) : [];
    formData.enabled = row.enabled === 1;
    // Password is not needed for edit
  });
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.id) {
          const updateParam: AdminUpdateParam = {
            id: formData.id,
            email: formData.email,
            phone: formData.phone,
            roleIds: formData.roleIds,
            enabled: formData.enabled,
            password: formData.password || undefined
          };
          await updateAdmin(formData.id, updateParam);
          ElMessage.success('更新成功');
        } else {
          const createParam: AdminCreateParam = {
            username: formData.username,
            password: formData.password!,
            email: formData.email,
            phone: formData.phone,
            roleIds: formData.roleIds,
            enabled: formData.enabled
          };
          await createAdmin(createParam);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchData();
      } catch (error) {
        // handled by request interceptor
      }
    }
  });
};

onMounted(() => {
  fetchData();
  fetchRoles();
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

.role-tag {
  margin-right: 5px;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}
</style>
