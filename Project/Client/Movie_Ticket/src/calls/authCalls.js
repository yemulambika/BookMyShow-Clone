import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
    baseURL : API_BASE_URL,
    withCredentials : true
})

export const register = async(values)=>{
    try {
       const response = await api.post('/api/auth/register' , values)
       return response.data
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Registration failed'
        }
    }
}

export const login = async(values)=>{
    try {
       const response = await api.post('/api/auth/login' , values)
       return response.data
    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Login failed'
        }
    }
}


export const getCurrentUser = async()=>{
    try {
       const response = await api.get('/api/auth/current-user' ,{withCredentials:true} )
       // Ensure consistent user data structure
       if (response.data && typeof response.data === 'object') {
         return {
           _id: response.data._id,
           name: response.data.name,
           email: response.data.email,
           role: response.data.role,
         };
       }
       return response.data;
    } catch (error) {
        console.log('Error getting current user:', error.response?.data || error.message)
        // Return null instead of undefined when there's an error
        return null
    }
}

export const logout = async()=>{
    try {
       const response = await api.post('/api/auth/logout' ,{withCredentials:true} )
       return response.data
    } catch (error) {
        console.log('Error logging out:', error.response?.data || error.message)
        return { success: false, message: 'Logout failed' }
    }
}

