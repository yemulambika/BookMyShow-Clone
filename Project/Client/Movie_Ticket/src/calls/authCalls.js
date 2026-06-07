import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

// Auto-refresh the access token once on a 401, then retry the original request.
// This keeps the user logged in across short-lived access-token expiry without
// forcing a re-login. Refresh and login/register calls are excluded to avoid loops.
let refreshPromise = null

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config
        const url = original?.url || ''
        const isAuthCall = url.includes('/api/auth/refresh') ||
            url.includes('/api/auth/login') ||
            url.includes('/api/auth/register')

        if (error.response?.status === 401 && !original?._retry && !isAuthCall) {
            original._retry = true
            try {
                if (!refreshPromise) {
                    refreshPromise = api.post('/api/auth/refresh').finally(() => {
                        refreshPromise = null
                    })
                }
                await refreshPromise
                return api(original)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export { api }

export const register = async (values) => {
    try {
        const response = await api.post('/api/auth/register', values)
        return response.data
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Registration failed'
        }
    }
}

export const login = async (values) => {
    try {
        const response = await api.post('/api/auth/login', values)
        return response.data
    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Login failed'
        }
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/api/auth/current-user')
        if (response.data && typeof response.data === 'object') {
            return {
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
            }
        }
        return response.data
    } catch (error) {
        console.log('Error getting current user:', error.response?.data || error.message)
        return null
    }
}

export const refreshToken = async () => {
    try {
        const response = await api.post('/api/auth/refresh')
        return response.data
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Refresh failed' }
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/api/auth/logout')
        return response.data
    } catch (error) {
        console.log('Error logging out:', error.response?.data || error.message)
        return { success: false, message: 'Logout failed' }
    }
}
