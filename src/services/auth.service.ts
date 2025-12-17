import apiClient from '@/lib/api-client';
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    User,
} from '@/types/api';

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<User> {
        const response = await apiClient.post<User>('/auth/register', data);
        return response.data;
    },

    /**
     * Login with username/email and password
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);

        // Store token in localStorage
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }

        return response.data;
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/auth/profile');

        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data));

        return response.data;
    },

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    },

    /**
     * Get stored user data
     */
    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Initiate Google OAuth login
     */
    getGoogleAuthUrl(): string {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/google/callback`;

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'email profile',
            access_type: 'offline',
            prompt: 'consent',
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },

    /**
     * Handle Google OAuth callback
     */
    async handleGoogleCallback(code: string): Promise<AuthResponse> {
        const response = await apiClient.get<{ data: AuthResponse }>(
            `/auth/google/callback?code=${code}`
        );

        const authData = response.data.data;

        // Store token
        if (authData.accessToken) {
            localStorage.setItem('accessToken', authData.accessToken);
        }

        return authData;
    },
};
