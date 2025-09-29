export * from './api';
export * from './routes';

// UI Constants (노인 친화적)
export const UI_CONSTANTS = {
  // Font sizes (elderly-friendly)
  FONT_SIZE: {
    XS: '14px',
    SM: '16px',
    BASE: '18px',
    LG: '20px',
    XL: '24px',
    '2XL': '30px',
    '3XL': '36px',
    '4XL': '48px',
  },

  // Touch target sizes
  TOUCH_TARGET: {
    MIN: '48px',
    COMFORT: '60px',
    PRIMARY: '72px',
  },

  // Spacing
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '16px',
    LG: '24px',
    XL: '32px',
    '2XL': '48px',
    '3XL': '64px',
  },

  // Breakpoints
  BREAKPOINTS: {
    MOBILE: '320px',
    MOBILE_LG: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
    DESKTOP_LG: '1280px',
  },

  // Animation durations
  ANIMATION: {
    FAST: '0.15s',
    NORMAL: '0.3s',
    SLOW: '0.5s',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'MARUNI',
  FULL_NAME: '마음이 닿는 안부',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: '노인 돌봄을 위한 AI 기반 소통 서비스',

  // Default settings
  DEFAULT_FONT_SIZE: 'medium',
  DEFAULT_THEME: 'light',
  DEFAULT_NOTIFICATION_TIME: '09:00',

  // Limits
  MAX_MESSAGE_LENGTH: 500,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_GUARDIANS: 5,
} as const;

// Emotion types
export const EMOTION_TYPES = {
  HAPPY: 'happy',
  NEUTRAL: 'neutral',
  SAD: 'sad',
  WORRIED: 'worried',
} as const;

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  SYSTEM: 'system',
} as const;

// Guardian relationships
export const GUARDIAN_RELATIONSHIPS = {
  CHILD: 'child',
  SPOUSE: 'spouse',
  CAREGIVER: 'caregiver',
  FRIEND: 'friend',
  OTHER: 'other',
} as const;