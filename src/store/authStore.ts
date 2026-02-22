import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  phone_number?: string;
  profile_picture?: string;
  is_verified: boolean;
  location_sharing_enabled: boolean;
  profile?: {
    bio?: string;
    city?: string;
    country?: string;
    items_found: number;
    items_lost: number;
    items_recovered: number;
    reputation_score: number;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; password2: string; phone_number?: string }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login/', { email, password });
          const { user, tokens } = response.data;
          
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data || { message: 'Login failed' };
        }
      },
      
      loginWithGoogle: async (credential: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/google-login/', { credential });
          const { user, tokens } = response.data;
          
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data || { message: 'Google login failed' };
        }
      },
      
      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register/', data);
          const { user, tokens } = response.data;
          
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data || { message: 'Registration failed' };
        }
      },
      
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },
      
      fetchUser: async () => {
        try {
          const response = await api.get('/auth/profile/');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

