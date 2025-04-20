import axios from 'axios';

// יצירת axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api/',  // כתובת ה-API של השרת
    headers: {
    }
});

let sessionHandled = false;

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        if ((error.response && (error.response.status === 422 || error.response.status === 401)) && !sessionHandled) {
            sessionHandled = true;
            alert("Your session has expired or your token is invalid. Please log in again.");
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
