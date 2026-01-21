/**
 * API service for communicating with SuperBryn backend.
 */

import type {
  TokenResponse,
  ConversationHistory,
  AdminAuthResponse,
  AdminStatsResponse,
  AppointmentsListResponse,
} from '../types';

// Remove trailing slash from URL if present
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

class ApiService {
  private baseUrl: string;
  private adminPassword: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    // Remove trailing slash to prevent double-slash issues
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.adminPassword) {
      headers['X-Admin-Password'] = this.adminPassword;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  // Get LiveKit token
  async getToken(
    roomName?: string,
    participantName?: string,
    userTimezone?: string
  ): Promise<TokenResponse> {
    return this.request('/api/token', {
      method: 'POST',
      body: JSON.stringify({
        room_name: roomName,
        participant_name: participantName,
        user_timezone: userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });
  }

  // Get conversation history for a phone number
  async getConversationHistory(
    phone: string,
    limit: number = 10
  ): Promise<ConversationHistory> {
    const encodedPhone = encodeURIComponent(phone);
    return this.request(`/api/history/${encodedPhone}?limit=${limit}`);
  }

  // Admin authentication
  setAdminPassword(password: string): void {
    this.adminPassword = password;
  }

  clearAdminPassword(): void {
    this.adminPassword = null;
  }

  async adminAuth(password: string): Promise<AdminAuthResponse> {
    const response = await this.request<AdminAuthResponse>('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (response.authenticated) {
      this.adminPassword = password;
    }

    return response;
  }

  // Get all appointments (admin)
  async getAppointments(
    limit: number = 100,
    offset: number = 0
  ): Promise<AppointmentsListResponse> {
    return this.request(`/api/admin/appointments?limit=${limit}&offset=${offset}`);
  }

  // Get admin stats
  async getAdminStats(): Promise<AdminStatsResponse> {
    return this.request('/api/admin/stats');
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for testing
export { ApiService };
