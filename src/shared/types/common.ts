// Base API Response Type
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
