import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse, User, Cafe, Booking, MenuItem, Order, Payment, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch {
            this.handleAuthFailure();
            return Promise.reject(error);
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshTokenPromise = (async () => {
      try {
        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        const newAccessToken = response.data.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('authToken', newAccessToken);
        }
        return newAccessToken!;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  private handleAuthFailure(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  private formatError(error: AxiosError): Error {
    if (error.response?.data) {
      const data = error.response.data as { message?: string; error?: string };
      return new Error(data.message || data.error || 'An error occurred');
    }
    if (error.message === 'Network Error') {
      return new Error('Unable to connect to server. Please check your connection.');
    }
    return new Error(error.message || 'An unexpected error occurred');
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { user, token, refreshToken } = response.data.data!;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token, refreshToken };
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { user, token, refreshToken } = response.data.data!;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token, refreshToken };
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  }

  async verifyEmail(token: string): Promise<void> {
    await this.client.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await this.client.post('/auth/resend-verification', { email });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.client.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.client.post('/auth/reset-password', { token, password });
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>('/users/profile', data);
    const user = response.data.data!;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async getCafes(params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Cafe>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Cafe>>>('/cafes', { params });
    return response.data.data!;
  }

  async getCafeById(id: string): Promise<Cafe> {
    const response = await this.client.get<ApiResponse<Cafe>>(`/cafes/${id}`);
    return response.data.data!;
  }

  async getCafeMenu(cafeId: string): Promise<MenuItem[]> {
    const response = await this.client.get<ApiResponse<MenuItem[]>>(`/cafes/${cafeId}/menu`);
    return response.data.data!;
  }

  async getTables(cafeId: string, date: string): Promise<{ id: string; number: number; capacity: number; isAvailable: boolean }[]> {
    const response = await this.client.get<ApiResponse<{ id: string; number: number; capacity: number; isAvailable: boolean }[]>>(`/cafes/${cafeId}/tables`, {
      params: { date }
    });
    return response.data.data!;
  }

  async createBooking(data: { cafeId: string; tableId: string; date: string; time: string; duration: number; numberOfPeople: number }): Promise<Booking> {
    const response = await this.client.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data!;
  }

  async getUserBookings(): Promise<Booking[]> {
    const response = await this.client.get<ApiResponse<Booking[]>>('/bookings/my-bookings');
    return response.data.data!;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await this.client.delete(`/bookings/${bookingId}`);
  }

  async createOrder(data: { bookingId: string; items: { menuItemId: string; quantity: number; specialInstructions?: string }[] }): Promise<Order> {
    const response = await this.client.post<ApiResponse<Order>>('/orders', data);
    return response.data.data!;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await this.client.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data!;
  }

  async getUserOrders(): Promise<Order[]> {
    const response = await this.client.get<ApiResponse<Order[]>>('/orders/my-orders');
    return response.data.data!;
  }

  async processPayment(data: { orderId: string; paymentMethod: 'ONLINE' | 'CASH'; paymentDetails?: Record<string, unknown> }): Promise<Payment> {
    const response = await this.client.post<ApiResponse<Payment>>('/payments', data);
    return response.data.data!;
  }

  async getPaymentHistory(): Promise<Payment[]> {
    const response = await this.client.get<ApiResponse<Payment[]>>('/payments/history');
    return response.data.data!;
  }
}

export const api = new ApiService();