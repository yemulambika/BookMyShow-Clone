import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
    baseURL : API_BASE_URL,
    withCredentials : true
})

export const addTheatre = async(values)=>{
    try {
       const response = await api.post('/api/theatre/add-theatre' , values)
       return response.data
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to add theatre'
        }
    }
}

export const updateTheatre = async (payload) => {
    try{
        const response = await api.put('/api/theatre/update-theatre', payload);
        return response.data;
    }catch(err){
        console.log(err);
        return {
            success: false,
            message: err.response?.data?.message || err.message || 'Failed to update theatre'
        };
    }
}

// Get theatres of a specific owner
export const getAllTheatres = async (payload) => {
    try{
        const response = await api.post('/api/theatre/get-all-theatres-by-owner', payload);
        return response.data;
    }catch(err){
        console.log(err);
        return {
            success: false,
            message: err.response?.data?.message || err.message || 'Failed to get theatres',
            data: []
        };
    }
}

export const getAllTheatresForAdmin = async () => {
    try{
        const response = await api.get('/api/theatre/get-all-theatres');
        return response.data;
    }catch(err){
        return err.response;
    }
}





