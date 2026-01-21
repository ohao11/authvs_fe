export interface ResultDTO<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageVO<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}

export interface LoginParam {
  username?: string;
  password?: string;
  deviceType?: string;
}

export interface LoginVo {
  token: string;
  message: string;
}

export interface UserQueryParam {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  phone?: string;
  enabled?: number;
}

export interface UserVo {
  id: number;
  username: string;
  email: string;
  phone: string;
  userType: number;
  enabled: boolean;
  createdAt?: string;
}

export interface UserForm {
  id?: number;
  username: string;
  password?: string;
  email: string;
  phone: string;
  userType: number;
  enabled: boolean;
}

export interface OperationLogQueryParam {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  operationType?: string;
  operationModule?: string;
  status?: string;
  ipAddress?: string;
  startTime?: string;
  endTime?: string;
}

export interface OperationLogVo {
  id: number;
  userId: number;
  username: string;
  operationType: string;
  operationModule: string;
  operationDesc: string;
  requestMethod: string;
  requestUrl: string;
  requestParams: string;
  responseResult: string;
  ipAddress: string;
  deviceType: string;
  userAgent: string;
  executeTime: number;
  status: string;
  errorMessage: string;
  createdAt: string;
}

export interface MenuVo {
  id: number;
  name: string;
  code: string;
  path: string;
  sort: number;
  parentId: number;
  children?: MenuVo[];
}

export interface RoleVo {
  id: number;
  roleName: string;
  roleCode: string;
}

export interface RoleListVo {
  id: number;
  roleName: string;
  roleCode: string;
  roleType: number;
  description: string;
  enabled: boolean;
}

export interface AdminQueryParam {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  phone?: string;
  enabled?: number;
}

export interface AdminVo {
  id: number;
  username: string;
  email: string;
  phone: string;
  roles: RoleVo[];
  enabled: number;
  createdAt: string;
}

export interface AdminCreateParam {
  username: string;
  password: string;
  email: string;
  phone: string;
  roleIds: number[];
  enabled: boolean;
}

export interface AdminUpdateParam {
  id: number;
  email: string;
  phone: string;
  password?: string;
  roleIds: number[];
  enabled: boolean;
}
