const TOKEN_KEY = 'nutrimind_token';
const USER_KEY = 'nutrimind_user';
const ONBOARDED_KEY = 'nutrimind_onboarded';

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  setUser: (user: object) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),

  isOnboarded: (): boolean => localStorage.getItem(ONBOARDED_KEY) === 'true',
  setOnboarded: () => localStorage.setItem(ONBOARDED_KEY, 'true'),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
