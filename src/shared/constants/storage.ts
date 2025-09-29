// Local Storage Keys
export const STORAGE_KEYS = {
  // Authentication
  ACCESS_TOKEN: 'maruni_access_token',
  REFRESH_TOKEN: 'maruni_refresh_token',
  USER_INFO: 'maruni_user_info',

  // User Settings
  SETTINGS: 'maruni_settings',
  FONT_SIZE: 'maruni_font_size',
  THEME_MODE: 'maruni_theme_mode',

  // App State
  LAST_CONVERSATION_ID: 'maruni_last_conversation_id',
  OFFLINE_MESSAGES: 'maruni_offline_messages',
  FCM_TOKEN: 'maruni_fcm_token',

  // Onboarding
  ONBOARDING_COMPLETED: 'maruni_onboarding_completed',
  FIRST_LOGIN: 'maruni_first_login',
} as const;

// Session Storage Keys (temporary data)
export const SESSION_STORAGE_KEYS = {
  FORM_DATA: 'maruni_form_data',
  NAVIGATION_STATE: 'maruni_navigation_state',
} as const;

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  CONVERSATIONS: 10 * 60 * 1000, // 10 minutes
  GUARDIANS: 15 * 60 * 1000, // 15 minutes
  SETTINGS: 30 * 60 * 1000, // 30 minutes
} as const;