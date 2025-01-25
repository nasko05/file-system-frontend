import axios from "axios";

// Set config defaults when creating the instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});
