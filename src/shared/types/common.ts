// 서버 응답 구조 (CommonApiResponse)
export interface CommonApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T | null;
}

// @deprecated - 서버 응답 구조 변경으로 사용 중단, CommonApiResponse 사용 권장
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Common Entity Fields
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  field?: string;
  timestamp: string;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Component Props with className
export interface WithClassName {
  className?: string;
}
