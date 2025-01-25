import {axiosInstance} from "./clientSetup.ts";
import {AxiosError} from "axios";

const fetchDriveStructure = async (username: string) => {
    const bearerToken = localStorage.getItem("bearerToken");

    const result = await axiosInstance.get(
        `/api/directory/${username}`,
        {
            headers: { Authorization: `Bearer ${bearerToken}` },
        }
    );

    console.log(result.status);
    console.log(result.statusText);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Login request failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }

    return result.data;
}

const uploadFile = async (username: string, path: string, file: File) => {
    const bearerToken = localStorage.getItem("bearerToken");

    // Use FormData to properly encode the file and path
    const formData = new FormData();
    formData.append("path", path);
    formData.append("file", file);

    const result = await axiosInstance.post(
        `/api/upload/${username}`,
        formData, // Send the FormData object
        {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "multipart/form-data", // Set the correct content type for file uploads
            },
        }
    );

    console.log(result.status);
    console.log(result.statusText);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Login request failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }
};

async function downloadFile(path: string, filename: string, userId: string): Promise<void> {
    try {
        const bearerToken = localStorage.getItem("bearerToken");
        // URL-encode the query parameters to ensure they are valid
        const encodedPath = encodeURIComponent(path);
        const encodedFilename = encodeURIComponent(filename);

        // Make the GET request to the endpoint
        const response = await axiosInstance.get(`/api/download/${userId}`, {
            params: {
                path: encodedPath,
                filename: encodedFilename,
            },
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "multipart/form-data", // Set the correct content type for file uploads
            },
        });

        console.log(response)

        // Trigger download using FileSaver.js or manually
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); // The downloaded file's name
        document.body.appendChild(link);
        link.click();

        // Cleanup: Remove the anchor and revoke the URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            // Handle Axios-specific HTTP errors
            console.error(
                `Error ${error.response.status}: ${error.response.data}`
            );
        } else if (error instanceof Error) {
            // Handle other types of errors
            console.error(`Error: ${error.message}`);
        } else {
            // Handle unknown error types
            console.error("An unknown error occurred");
        }
    }
}

export {fetchDriveStructure, uploadFile, downloadFile};