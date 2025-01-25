import {Menu, MenuItem} from "@mui/material";
import React from "react";
import {downloadFile} from "../logic/structure_requests.ts";

type ContextMenuProps = {
    selectedItem: string | null;
    setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
    contextMenu: { mouseX: number; mouseY: number } | null;
    setContextMenu: React.Dispatch<React.SetStateAction<{ mouseX: number; mouseY: number } | null>>;
    userId: string; // User ID for the API request
    currentPath: string; // Current directory path
}

export default function ContextMenu(props: ContextMenuProps) {

    const handleCloseContextMenu = () => {
        props.setContextMenu(null);
        props.setSelectedItem(null);
    };

    const handleRename = () => {
        // Implement rename logic
        console.log(`Rename ${props.selectedItem}`);
        handleCloseContextMenu();
    };

    const handleDelete = () => {
        // Implement delete logic
        console.log(`Delete ${props.selectedItem}`);
        handleCloseContextMenu();
    };

    const handleDownload = () => {
        // Implement download logic
        console.log(`Download ${props.selectedItem}`);
        downloadFile(props.selectedItem!, props.currentPath, props.userId).then(
            () => handleCloseContextMenu()
        ).catch(console.error);
    };

    return (
        <Menu
            open={props.contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
                props.contextMenu !== null
                    ? { top: props.contextMenu.mouseY, left: props.contextMenu.mouseX }
                    : undefined
            }
        >
            <MenuItem onClick={handleRename}>Rename</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
            <MenuItem onClick={handleDownload}>Download</MenuItem>
        </Menu>
    )
}