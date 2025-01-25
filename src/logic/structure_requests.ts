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

export {fetchDriveStructure, uploadFile};