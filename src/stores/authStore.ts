import { defineStore } from 'pinia';
import service from '@/services/baseService';
import CONFIG from '@/config/app';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'), // Load user from localStorage
    token: localStorage.getItem('token'), // Load token from localStorage
    isAuthenticated: !!localStorage.getItem('token'), // Check if token exists
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
    hasPermission: (state) => (permission: string) => {
      return !!state.user.allowedPermissions[permission];
    },
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        // Call the login endpoint using the baseService
        const response = await service.post(CONFIG.api.login, credentials);
        if (response) {
          this.user = response.user;
          this.token = response.token.token;
          this.isAuthenticated = true;

          // Save the token and user to localStorage
          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('token', this.token);

          // Set the token in the baseService for future requests
          service.setToken(this.token);
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error; // Re-throw the error to handle it in the component
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // Clear the token and user from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Clear the token in the baseService
      service.setToken(null);
    },
    async me() {
      try {
        // Call the login endpoint using the baseService
        const response = await service.get(CONFIG.api.me)
        if (response) {
          this.user = response
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        console.error('Login failed:', error)
        throw error // Re-throw the error to handle it in the component
      }
    },
  },
})
