import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios'

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
    statusCode?: number
}

export interface ApiError extends AxiosError {
    response?: AxiosResponse<ApiResponse>
}

class ApiClient {
    private axiosInstance: AxiosInstance
    private retryCount: Map<string, number> = new Map()
    private maxRetries = 3
    private retryDelay = 1000 // ms

    constructor() {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')

        this.axiosInstance = axios.create({
            baseURL,
            timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Add JWT token if available
                const token = localStorage.getItem(
                    import.meta.env.VITE_JWT_STORAGE_KEY || 'flashai_token'
                )
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }

                // Log request in development
                if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
                    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
                }

                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
                    console.log(`[API] Response: ${response.status} ${response.config.url}`)
                }
                return response
            },
            async (error: AxiosError) => {
                const config = error.config

                if (!config) {
                    return Promise.reject(error)
                }

                // Handle token expiration
                if (error.response?.status === 401) {
                    localStorage.removeItem(
                        import.meta.env.VITE_JWT_STORAGE_KEY || 'flashai_token'
                    )
                    window.location.href = '/auth/login'
                    return Promise.reject(error)
                }

                // Handle network errors with retry logic
                if (!error.response && config) {
                    const key = `${config.method}:${config.url}`
                    const retries = this.retryCount.get(key) || 0

                    if (retries < this.maxRetries) {
                        this.retryCount.set(key, retries + 1)
                        await new Promise((resolve) =>
                            setTimeout(resolve, this.retryDelay * (retries + 1))
                        )
                        return this.axiosInstance(config)
                    }
                }

                // Log error in development
                if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
                    console.error(`[API Error]`, error.message)
                }

                return Promise.reject(error)
            }
        )
    }

    // Generic request method
    async request<T = unknown>(
        method: string,
        url: string,
        data?: unknown,
        config?: any
    ): Promise<T> {
        try {
            const response = await this.axiosInstance({
                method,
                url,
                data,
                ...config,
            })
            return response.data
        } catch (error) {
            throw this.handleError(error as AxiosError)
        }
    }

    // Convenience methods
    get<T = unknown>(url: string, config?: any): Promise<T> {
        return this.request<T>('GET', url, undefined, config)
    }

    post<T = unknown>(url: string, data?: unknown, config?: any): Promise<T> {
        return this.request<T>('POST', url, data, config)
    }

    put<T = unknown>(url: string, data?: unknown, config?: any): Promise<T> {
        return this.request<T>('PUT', url, data, config)
    }

    patch<T = unknown>(url: string, data?: unknown, config?: any): Promise<T> {
        return this.request<T>('PATCH', url, data, config)
    }

    delete<T = unknown>(url: string, config?: any): Promise<T> {
        return this.request<T>('DELETE', url, undefined, config)
    }

    // Error handling
    private handleError(error: AxiosError): Error {
        if (error.response) {
            // Server responded with error status
            const data = error.response.data as any
            const message = data?.message || data?.error || 'An error occurred'
            const apiError = new Error(message)
            apiError.name = `${error.response.status}`
            return apiError
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server. Please check your connection.')
        } else {
            // Error in request setup
            return error
        }
    }

    // Check if error is of specific type
    isNetworkError(error: unknown): boolean {
        return error instanceof Error && error.message.includes('Network')
    }

    isTimeoutError(error: unknown): boolean {
        return error instanceof Error && error.message.includes('timeout')
    }

    isAuthError(error: unknown): boolean {
        return error instanceof Error && error.name === '401'
    }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
