export const ROUTES = {
  // Public routes
  ROOT: '/',

  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  // Protected routes
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',
  GUARDIANS: '/guardians',
  SETTINGS: '/settings',

  // Nested routes
  GUARDIAN: {
    LIST: '/guardians',
    ADD: '/guardians/add',
    EDIT: (id: string) => `/guardians/${id}/edit`,
  },

  SETTINGS_NESTED: {
    PROFILE: '/settings/profile',
    NOTIFICATIONS: '/settings/notifications',
    ACCESSIBILITY: '/settings/accessibility',
  },
} as const;

// Route names for navigation and analytics
export const ROUTE_NAMES = {
  DASHBOARD: 'dashboard',
  CONVERSATION: 'conversation',
  GUARDIANS: 'guardians',
  SETTINGS: 'settings',
  LOGIN: 'login',
  REGISTER: 'register',
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.CONVERSATION,
  ROUTES.GUARDIANS,
  ROUTES.SETTINGS,
] as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
] as const;