import request from '../utils/request';
import type { 
  PageVO, 
  LoginParam, 
  LoginVo, 
  UserQueryParam, 
  UserVo, 
  OperationLogQueryParam, 
  OperationLogVo,
  MenuVo,
  AdminQueryParam,
  AdminVo,
  AdminCreateParam,
  AdminUpdateParam,
  RoleListVo,
  ClientQueryParam,
  ClientVo,
  ClientSaveParam,
  ClientSecretVo
} from './types';

export const login = (data: LoginParam) => {
  return request<any, LoginVo>({
    url: '/api/auth/login',
    method: 'post',
    data,
  });
};

export const logout = () => {
  return request<any, void>({
    url: '/api/auth/logout',
    method: 'post',
  });
};

export const getMe = () => {
  return request<any, UserVo>({
    url: '/api/me',
    method: 'get',
  });
};

export const getUserList = (data: UserQueryParam) => {
  return request<any, PageVO<UserVo>>({
    url: '/api/users/page',
    method: 'post',
    data,
  });
};

export const getUserDetail = (userId: number) => {
  return request<any, UserVo>({
    url: `/api/users/${userId}/detail`,
    method: 'get',
  });
};

export const getAdminList = (data: AdminQueryParam) => {
  return request<any, PageVO<AdminVo>>({
    url: '/api/admins/page',
    method: 'post',
    data,
  });
};

export const createAdmin = (data: AdminCreateParam) => {
  return request<any, number>({
    url: '/api/admins',
    method: 'post',
    data,
  });
};

export const updateAdmin = (id: number, data: AdminUpdateParam) => {
  return request<any, boolean>({
    url: `/api/admins/${id}`,
    method: 'put',
    data,
  });
};

export const getAdminDetail = (id: number) => {
  return request<any, AdminVo>({
    url: `/api/admins/${id}/detail`,
    method: 'get',
  });
};

export const getAdminRoles = () => {
  return request<any, RoleListVo[]>({
    url: '/api/admins/roles',
    method: 'get',
  });
};

export const getOperationLogs = (data: OperationLogQueryParam) => {
  return request<any, PageVO<OperationLogVo>>({
    url: '/api/operation-logs/page',
    method: 'post',
    data,
  });
};

export const archiveLogs = () => {
  return request<any, number>({
    url: '/api/operation-logs/archive',
    method: 'post',
  });
};

export const getUserMenus = () => {
  return request<any, MenuVo[]>({
    url: '/api/menu/user-menus',
    method: 'get',
  });
};

export const getClientList = (data: ClientQueryParam) => {
  return request<any, PageVO<ClientVo>>({
    url: '/api/clients/page',
    method: 'post',
    data,
  });
};

export const createClient = (data: ClientSaveParam) => {
  return request<any, ClientVo>({
    url: '/api/clients',
    method: 'post',
    data,
  });
};

export const updateClient = (id: number, data: ClientSaveParam) => {
  return request<any, ClientVo>({
    url: `/api/clients/${id}`,
    method: 'put',
    data,
  });
};

export const getClientDetail = (id: number) => {
  return request<any, ClientVo>({
    url: `/api/clients/${id}`,
    method: 'get',
  });
};

export const resetClientSecret = (id: number) => {
  return request<any, ClientSecretVo>({
    url: `/api/clients/${id}/reset-secret`,
    method: 'post',
  });
};

export const deleteClient = (id: number) => {
  return request<any, void>({
    url: `/api/clients/${id}`,
    method: 'delete',
  });
};
