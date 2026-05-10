import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create({
    baseURL : API_BASE_URL,
    withCredentials : true
})

export const getAllMovies = async()=>{
    try {
       const response = await api.get('/api/movie/all-movies')
       return response.data
    } catch (error) {
        console.log(error)
    }
}


export const addMovie = async(values)=>{
    try {
       const response = await api.post('/api/movie/add-movie' , values)
       return response.data
    } catch (error) {
        console.log(error)
    }
}

export const updateMovie = async(payload)=>{
    try {
       const response = await api.put('/api/movie/update-movie' , payload)
       return response.data
    } catch (error) {
        console.log(error)
    }
}


export const getSingleMovie = async(id)=>{
    try {
       const response = await api.get(`/api/movie/${id}`)
       return response.data
    } catch (error) {
        console.log(error)
    }
}

