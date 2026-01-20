import request from '../utils/request';
import type { 
  PageVO, 
  LoginParam, 
  LoginVo, 
  UserQueryParam, 
  UserVo, 
  OperationLogQueryParam, 
  OperationLogVo 
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

export const getUserList = (data: UserQueryParam) => {
  return request<any, PageVO<UserVo>>({
    url: '/api/users/page',
    method: 'post',
    data,
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
