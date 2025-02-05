import {Box, Button, Typography} from "@mui/material";
import DriveStructure from "../../models/DriveStructure";
import CreateDirectoryButton from "../buttons/CreateDirectoryButton.tsx";
import React from "react";

type NavigationBarProps = {
    pathStack: string[];
    currentStructure: DriveStructure;
    goBack: () => void;
    currentPath: string;
    uploadFinishedFlag: boolean;
    setUploadFinishedFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavigationBar(props: NavigationBarProps) {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
                {props.pathStack.length === 0
                    ? `Welcome, ${props.currentStructure.name}`
                    : props.currentStructure.name}
            </Typography>
            <Box justifySelf="center">
                {props.pathStack.length > 0 && (
                    <Button variant="outlined" onClick={props.goBack}>
                        Back
                    </Button>
                )}
            </Box>
            <Box justifySelf="end">
                <CreateDirectoryButton
                    currentPath={props.currentPath}
                    uploadFinishedFlag={props.uploadFinishedFlag}
                    setUploadFinishedFlag={props.setUploadFinishedFlag}
                />
            </Box>
        </Box>
    )
}