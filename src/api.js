import axios from "axios";
import { useNavigate } from "react-router";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403){
            useNavigate().push('/accessDenied');
        }
        return Promise.reject(error);
    }
);

export default api;