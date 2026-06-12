import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppPage, AuthState, ToastItem, User } from '../types';
import { storage } from '../lib/storage';

interface AppState {
  page: AppPage;
  authState: AuthState;
  user: User | null;
  sidebarCollapsed: boolean;
  toasts: ToastItem[];
  backendOnline: boolean;
}

type Action =
  | { type: 'SET_PAGE'; page: AppPage }
  | { type: 'SET_AUTH'; authState: AuthState; user?: User | null }
  | { type: 'SET_USER'; user: User }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_TOAST'; toast: ToastItem }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'SET_BACKEND'; online: boolean };

const initialState: AppState = {
  page: 'landing',
  authState: 'unauthenticated',
  user: null,
  sidebarCollapsed: false,
  toasts: [],
  backendOnline: true,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE': return { ...state, page: action.page };
    case 'SET_AUTH': return {
      ...state,
      authState: action.authState,
      user: action.user !== undefined ? action.user : state.user,
    };
    case 'SET_USER': return { ...state, user: action.user };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'SET_BACKEND': return { ...state, backendOnline: action.online };
    default: return state;
  }
}

interface AppContextValue {
  state: AppState;
  navigate: (page: AppPage) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleSidebar: () => void;
  toast: (type: ToastItem['type'], title: string, message?: string) => void;
  setBackendOnline: (online: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init): AppState => {
    const token = storage.getToken();
    const user = storage.getUser();
    if (token && user) {
      return { ...init, authState: 'authenticated' as const, user };
    }
    return init;
  });

  const navigate = useCallback((page: AppPage) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  const login = useCallback((user: User, token: string) => {
    storage.setToken(token);
    storage.setUser(user);
    dispatch({ type: 'SET_AUTH', authState: 'authenticated', user });
    if (!storage.isOnboarded()) {
      dispatch({ type: 'SET_PAGE', page: 'onboarding' });
    } else {
      dispatch({ type: 'SET_PAGE', page: 'dashboard' });
    }
  }, []);

  const logout = useCallback(() => {
    storage.clearAll();
    dispatch({ type: 'SET_AUTH', authState: 'unauthenticated', user: null });
    dispatch({ type: 'SET_PAGE', page: 'landing' });
  }, []);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);

  const toast = useCallback((type: ToastItem['type'], title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    dispatch({ type: 'ADD_TOAST', toast: { id, type, title, message } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 4000);
  }, []);

  const setBackendOnline = useCallback((online: boolean) => {
    dispatch({ type: 'SET_BACKEND', online });
  }, []);

  // Listen for auth logout event from API
  React.useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  return (
    <AppContext.Provider value={{ state, navigate, login, logout, toggleSidebar, toast, setBackendOnline }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
