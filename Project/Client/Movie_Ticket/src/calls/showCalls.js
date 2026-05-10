import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
    baseURL : API_BASE_URL,
    withCredentials : true
})


// add a show
export const addShow = async (payload) => {
    try{
        const response = await api.post('/api/shows/add-show', payload);
        return response.data;
    }catch(err){
        return err.message;
    }
}

export const getShows = async (payload) => {
    try{
        const response = await api.post('/api/shows/get-all-shows' , payload);
        return response.data;
    }catch(err){
        return err.message;
    }
}


export const getAllTheatresAndShows = async (payload) => {
    try{
        const response = await api.post('/api/shows/get-all-theatres-by-movie' , payload);
        return response.data;
    }catch(err){
        return err.message;
    }
}

export const getTheShow = async (payload) => {
    try{
        const response = await api.post('/api/shows/get-show-by-id' , payload);
        return response.data;
    }catch(err){
        return err.message;
    }
}


