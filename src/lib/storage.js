// src/lib/storage.js

export const STORAGE_KEYS = {
  USERS: 'recruit_users',
  CURRENT_USER: 'recruit_current_user',
  JOBS: 'recruit_jobs',
  APPLICATIONS: 'recruit_applications',
  PROFILES: 'recruit_profiles',
};

export const getStorageItem = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};
