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
