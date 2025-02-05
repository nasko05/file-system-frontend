// src/components/CreateDirectoryButton.tsx
import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import {createDirectory} from "../../logic/structure_requests.ts";

interface CreateDirectoryButtonProps {
    currentPath: string; // e.g., "some/subdir"
    // If you're storing the user's name or ID, you can pass that if needed.
    // username: string;

    // We toggle this flag to force re-fetching or re-rendering in the parent:
    uploadFinishedFlag: boolean;
    setUploadFinishedFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateDirectoryButton(props: CreateDirectoryButtonProps) {
    const { currentPath, uploadFinishedFlag, setUploadFinishedFlag } = props;

    const [open, setOpen] = useState(false);
    const [dirName, setDirName] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setDirName("");
    };

    const handleCreate = () => {
        if (!dirName.trim()) {
            // Optionally, show an error or do nothing
            return;
        }
        createDirectory(currentPath, dirName)
            .then(() => {
                // Once directory is created, toggle the flag to refresh your drive structure
                setUploadFinishedFlag(!uploadFinishedFlag);
                handleClose();
            })
            .catch((err) => {
                console.error("Failed to create directory:", err);
                // Optionally show a Snackbar or other error message
            });
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Create Directory
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Directory</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Directory Name"
                        fullWidth
                        value={dirName}
                        onChange={(e) => setDirName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}