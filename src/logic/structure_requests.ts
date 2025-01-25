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

    if (result.status !== 200) {
        throw new Error("Login request failed!\nReturn code is " + result.statusText + "\n Error message: " + result.statusText);
    }

    return result.data;
}

export {fetchDriveStructure};