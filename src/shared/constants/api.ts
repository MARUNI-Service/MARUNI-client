export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Member endpoints
  MEMBERS: {
    BASE: '/members',
    PROFILE: '/members/profile',
    REGISTER: '/members/register',
  },

  // Conversation endpoints
  CONVERSATIONS: {
    BASE: '/conversations',
    MESSAGES: '/conversations/messages',
    HISTORY: '/conversations/history',
  },

  // Daily check endpoints
  DAILY_CHECK: {
    BASE: '/daily-check',
    TODAY: '/daily-check/today',
    RESPONSE: '/daily-check/response',
    HISTORY: '/daily-check/history',
  },

  // Guardian endpoints
  GUARDIANS: {
    BASE: '/guardians',
    SETTINGS: '/guardians/settings',
    NOTIFICATIONS: '/guardians/notifications',
  },

  // Alert rule endpoints
  ALERT_RULES: {
    BASE: '/alert-rules',
    HISTORY: '/alert-rules/history',
    SETTINGS: '/alert-rules/settings',
  },

  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    SETTINGS: '/notifications/settings',
    FCM_TOKEN: '/notifications/fcm-token',
  },
} as const;

export const API_TIMEOUT = 10000; // 10 seconds

export const RETRY_CONFIG = {
  attempts: 3,
  delay: 1000, // 1 second
  factor: 2, // exponential backoff
} as const;