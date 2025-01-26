import {Box, Button, Typography} from "@mui/material";
import DriveStructure from "../../models/DriveStructure";

type NavigationBarProps = {
    pathStack: string[];
    currentStructure: DriveStructure;
    goBack: () => void;
}

export default function NavigationBar({pathStack, currentStructure, goBack}: NavigationBarProps) {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
                {pathStack.length === 0
                    ? `Welcome, ${currentStructure.name}`
                    : currentStructure.name}
            </Typography>
            {pathStack.length > 0 && (
                <Button variant="outlined" onClick={goBack}>
                    Back
                </Button>
            )}
        </Box>
    )
}