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

// Emotion Types
export type EmotionType = 'happy' | 'neutral' | 'sad' | 'worried';

// Message Types
export type MessageType = 'text' | 'image' | 'voice' | 'system';

// Guardian Relationship Types
export type GuardianRelationship = 'child' | 'spouse' | 'caregiver' | 'friend' | 'other';

// Font Size Types
export type FontSize = 'small' | 'medium' | 'large';

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';

// Form Validation
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Generic Form State
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// File Upload
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

// Notification Types
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

// Device Info
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsTouch: boolean;
}

// Geolocation
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

// Event Handler Types
export type EventHandler<T = unknown> = (event: T) => void;
export type AsyncEventHandler<T = unknown> = (event: T) => Promise<void>;

// Component Props with children
export interface WithChildren {
  children: React.ReactNode;
}

// Component Props with className
export interface WithClassName {
  className?: string;
}

// Generic Component Props
export type ComponentProps<T = Record<string, unknown>> = T & WithChildren & WithClassName;