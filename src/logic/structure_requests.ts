import {axiosInstance} from "./clientSetup.ts";

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
        // URL-encode the query parameters to ensure they are valid
        const encodedPath = encodeURIComponent(path);
        const encodedFilename = encodeURIComponent(filename);

        // Make the GET request to the endpoint
        const response = await axiosInstance.get(`/api/download/${userId}`, {
            params: {
                path: encodedPath,
                filename: encodedFilename,
            },
            responseType: "blob", // Expect binary data
        });

        // Create a download link and trigger the download
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Suggest the original filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error: any) {
        if (error.response) {
            // Handle HTTP errors
            console.error(`Error ${error.response.status}: ${error.response.data}`);
        } else {
            // Handle network or other errors
            console.error(`Error: ${error.message}`);
        }
    }
}

export {fetchDriveStructure, uploadFile, downloadFile};