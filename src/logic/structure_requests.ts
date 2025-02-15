import {axiosInstance} from "./clientSetup.ts";
import {AxiosError} from "axios";

const fetchDriveStructure = async () => {
    const bearerToken = localStorage.getItem("bearerToken");

    const result = await axiosInstance.post(
        `/api/structure`,
        {
            "path": ""
        },
        {
            headers: { Authorization: `Bearer ${bearerToken}` },
        }
    );

    console.log(result.status);
    console.log(result.statusText);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Fetching drive structure failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }

    return result.data;
}

const uploadFile = async (path: string, file: File) => {
    const bearerToken = localStorage.getItem("bearerToken");

    // Use FormData to properly encode the file and path
    const formData = new FormData();
    formData.append("path", path);
    formData.append("file", file);

    const result = await axiosInstance.post(
        `/api/upload`,
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
        throw new Error("Uploading file failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }
};

async function downloadFile(path: string, filename: string): Promise<void> {
    try {
        const bearerToken = localStorage.getItem("bearerToken");

        // Make the GET request to the endpoint
        const response = await axiosInstance.post('/api/download',
            {
                path: path,
                name: filename,
            },
            {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                        "Content-Type": "application/json", // Set the correct content type for file uploads
                },
            }
        );

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

async function downloadDirectory(path: string, directoryName: string): Promise<void> {
    try {
        const bearerToken = localStorage.getItem("bearerToken");

        // Make the POST request to download the directory as a zip blob
        const response = await axiosInstance.post(
            "/api/download/directory",
            { path, name: directoryName },
            {
                responseType: "blob", // Important to receive binary data
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "application/json"
                },
            }
        );

        // Convert the response data into a blob and create an object URL
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        // You can append ".zip" if you want the downloaded file to have a .zip extension:
        link.setAttribute("download", directoryName + ".zip");
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error(`Error ${error.response.status}: ${error.response.data}`);
        } else if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error("An unknown error occurred");
        }
    }
}

const deleteFile = async (path: string, name: string): Promise<void> => {
    const bearerToken = localStorage.getItem("bearerToken");
    console.log(path, " ", name);
    const result = await axiosInstance.post(
        `/api/file/delete`,
        {
            path: path,
            name: name,
        },
        {
            headers: { Authorization: `Bearer ${bearerToken}` },
        }
    );

    console.log(result.status);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Deleting file failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }
}

const deleteDirectory = async (path: string, name: string): Promise<void> => {
    const bearerToken = localStorage.getItem("bearerToken");
    console.log(path, " ", name);
    const result = await axiosInstance.post(
        `/api/directory/delete`,
        {
            path: path,
            name: name,
        },
        {
            headers: { Authorization: `Bearer ${bearerToken}` },
        }
    );

    console.log(result.status);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Deleting file failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }
}

const renameFile = async (
    path: string,
    old_name: string,
    new_name: string
): Promise<void> => {
    const bearerToken = localStorage.getItem("bearerToken");

    const payload = {
        path: path,
        old_name: old_name,
        new_name: new_name,
    }

    const result = await axiosInstance.post('/api/directory/rename',
        payload,
        {
            headers: { Authorization: `Bearer ${bearerToken}` },
        });

    console.log(result.status);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Could not rename file!");
    }
}

const createDirectory = async (path: string, name: string): Promise<void> => {
    const bearerToken = localStorage.getItem("bearerToken");
    const payload = {
        path: path,
        name: name,
    }
    const result = await axiosInstance.post('/api/directory/create',
        payload,
        {
            headers: { Authorization: `Bearer ${bearerToken}` },
        })


    console.log(result.status);

    if(result.status === 401) {
        throw new Error("Unauthorized");
    } else if (result.status !== 200) {
        throw new Error("Could not create directory file!");
    }
}

export {downloadDirectory, fetchDriveStructure, uploadFile, downloadFile, deleteFile, renameFile, deleteDirectory, createDirectory};