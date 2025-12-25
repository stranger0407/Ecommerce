import { create } from 'zustand';
import { AuthResponse } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (user: AuthResponse) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user: AuthResponse) => {
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = authService.getCurrentUser();
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
}));
