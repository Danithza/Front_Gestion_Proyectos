import { defineStore } from 'pinia';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

// Tipos para la respuesta del login
interface User {
  id: number;
  name: string;
  email: string;
  // Agrega aquí más campos si tu usuario tiene otros atributos
}

interface LoginResponse {
  token: {
    type: string;
    token: string;
    expires_at?: string;
  };
  user: User;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') as string | null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const response = await service.post<LoginResponse>(CONFIG.api.login, credentials);

        if (response && response.token && response.user) {
          this.user = response.user;
          this.token = response.token.token;
          this.isAuthenticated = true;

          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('token', this.token);

          service.setToken(this.token);
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      service.setToken(null);
    },
  },
});
