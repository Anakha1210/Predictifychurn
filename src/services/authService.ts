import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      return data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('Login failed');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
  }
};