export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultSaveToAccount: boolean;
  notificationsEnabled: boolean;
}