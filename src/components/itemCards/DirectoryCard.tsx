import {Card, Grid, Typography} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DriveStructure from "../../models/DriveStructure";
import React from "react";

type DirectoryCardProps = {
    directory: DriveStructure;
    openFolder: (folderName: string) => void;
    handleContextMenu: (event: React.MouseEvent, itemName: string) => void;
}

export default function DirectoryCard({ directory, openFolder, handleContextMenu }: DirectoryCardProps) {
    return (
        <Grid item xs={12} sm={6} md={4} key={directory.name}>
        <Card
            data-item-type="directory"
            variant="outlined"
            sx={{
                height: 150,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                boxShadow: 1,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 4,
                },
            }}
            onContextMenu={(e) => handleContextMenu(e, directory.name)}
            onClick={() => openFolder(directory.name)}
        >
            <FolderIcon sx={{ fontSize: 36, color: "#1976d2" }} />
            <Typography mt={1} fontWeight="medium">
                {directory.name}
            </Typography>
        </Card>
    </Grid>)
}