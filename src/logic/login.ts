import Credentials from "../models/Credential";
import axios from "axios";

// Set config defaults when creating the instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});

export const check_credentials = async (credentials: Credentials) => {
    console.log('Base URL:', import.meta.env.VITE_SERVER_URL);

    const result = await axiosInstance.post(
        "/login",
        credentials
    );

    console.log(result.status);
    console.log(result.statusText);

    if (result.status !== 200) {
        throw new Error("Login request failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }

    const bearerToken = result.data.token;

    localStorage.setItem("bearerToken", bearerToken);
}
