import { STORAGE_KEYS, SESSION_STORAGE_KEYS } from '@/constants';

class StorageManager {
  // Local Storage Methods
  private setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to set localStorage item:', key, error);
    }
  }

  private getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to get localStorage item:', key, error);
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove localStorage item:', key, error);
    }
  }

  // Session Storage Methods
  private setSessionItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to set sessionStorage item:', key, error);
    }
  }

  private getSessionItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to get sessionStorage item:', key, error);
      return null;
    }
  }

  private removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove sessionStorage item:', key, error);
    }
  }

  // JSON Storage Methods
  setJSON<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }

  getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('Failed to parse JSON from localStorage:', key, error);
      return null;
    }
  }

  setSessionJSON<T>(key: string, value: T): void {
    this.setSessionItem(key, JSON.stringify(value));
  }

  getSessionJSON<T>(key: string): T | null {
    const item = this.getSessionItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('Failed to parse JSON from sessionStorage:', key, error);
      return null;
    }
  }

  // Authentication Methods
  setAccessToken(token: string): void {
    this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserInfo<T>(userInfo: T): void {
    this.setJSON(STORAGE_KEYS.USER_INFO, userInfo);
  }

  getUserInfo<T>(): T | null {
    return this.getJSON<T>(STORAGE_KEYS.USER_INFO);
  }

  clearAuth(): void {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeItem(STORAGE_KEYS.USER_INFO);
  }

  // Settings Methods
  setFontSize(fontSize: string): void {
    this.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
  }

  getFontSize(): string | null {
    return this.getItem(STORAGE_KEYS.FONT_SIZE);
  }

  setThemeMode(theme: string): void {
    this.setItem(STORAGE_KEYS.THEME_MODE, theme);
  }

  getThemeMode(): string | null {
    return this.getItem(STORAGE_KEYS.THEME_MODE);
  }

  setSettings<T>(settings: T): void {
    this.setJSON(STORAGE_KEYS.SETTINGS, settings);
  }

  getSettings<T>(): T | null {
    return this.getJSON<T>(STORAGE_KEYS.SETTINGS);
  }

  // App State Methods
  setLastConversationId(id: string): void {
    this.setItem(STORAGE_KEYS.LAST_CONVERSATION_ID, id);
  }

  getLastConversationId(): string | null {
    return this.getItem(STORAGE_KEYS.LAST_CONVERSATION_ID);
  }

  setOfflineMessages<T>(messages: T[]): void {
    this.setJSON(STORAGE_KEYS.OFFLINE_MESSAGES, messages);
  }

  getOfflineMessages<T>(): T[] {
    return this.getJSON<T[]>(STORAGE_KEYS.OFFLINE_MESSAGES) || [];
  }

  clearOfflineMessages(): void {
    this.removeItem(STORAGE_KEYS.OFFLINE_MESSAGES);
  }

  setFCMToken(token: string): void {
    this.setItem(STORAGE_KEYS.FCM_TOKEN, token);
  }

  getFCMToken(): string | null {
    return this.getItem(STORAGE_KEYS.FCM_TOKEN);
  }

  // Onboarding Methods
  setOnboardingCompleted(completed: boolean): void {
    this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, String(completed));
  }

  isOnboardingCompleted(): boolean {
    return this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
  }

  setFirstLogin(isFirst: boolean): void {
    this.setItem(STORAGE_KEYS.FIRST_LOGIN, String(isFirst));
  }

  isFirstLogin(): boolean {
    return this.getItem(STORAGE_KEYS.FIRST_LOGIN) === 'true';
  }

  // Session Methods
  setFormData<T>(data: T): void {
    this.setSessionJSON(SESSION_STORAGE_KEYS.FORM_DATA, data);
  }

  getFormData<T>(): T | null {
    return this.getSessionJSON<T>(SESSION_STORAGE_KEYS.FORM_DATA);
  }

  clearFormData(): void {
    this.removeSessionItem(SESSION_STORAGE_KEYS.FORM_DATA);
  }

  setNavigationState<T>(state: T): void {
    this.setSessionJSON(SESSION_STORAGE_KEYS.NAVIGATION_STATE, state);
  }

  getNavigationState<T>(): T | null {
    return this.getSessionJSON<T>(SESSION_STORAGE_KEYS.NAVIGATION_STATE);
  }

  // Utility Methods
  clear(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getStorageSize(): { localStorage: number; sessionStorage: number } {
    let localStorageSize = 0;
    let sessionStorageSize = 0;

    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage.getItem(key)?.length || 0;
        }
      }

      for (const key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          sessionStorageSize += sessionStorage.getItem(key)?.length || 0;
        }
      }
    } catch (error) {
      console.warn('Failed to calculate storage size:', error);
    }

    return { localStorage: localStorageSize, sessionStorage: sessionStorageSize };
  }
}

export const storage = new StorageManager();