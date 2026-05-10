import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
    baseURL : API_BASE_URL,
    withCredentials : true
})

// Create Stripe checkout session
export const createCheckoutSession = async (paymentData) => {
    try {
        const response = await api.post('/api/booking/create-checkout-session', paymentData);
        return response.data;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to create checkout session'
        };
    }
}

// Verify payment
export const verifyPayment = async (sessionId) => {
    try {
        const response = await api.post('/api/booking/verify-payment', { sessionId });
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to verify payment'
        };
    }
}

// Get user bookings
export const getUserBookings = async (userId) => {
    try {
        const response = await api.post('/api/booking/get-user-bookings', { userId });
        return response.data;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch bookings',
            data: []
        };
    }
}
