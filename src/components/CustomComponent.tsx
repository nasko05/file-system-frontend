import {SyntheticEvent, useEffect, useState} from "react";
import {
    Typography,
    Box,
    Button,
    Card,
    Container,
    Grid,
    TextField, Snackbar, Alert, AlertColor, SnackbarCloseReason,
} from "@mui/material";
import DriveStructure from "../models/DriveStructure";
import {check_credentials} from "../logic/login.ts";
import {fetchDriveStructure, uploadFile} from "../logic/structure_requests.ts";
import AppToolBar from "./AppToolBar.tsx";
import FileCard from "./itemCards/FileCard.tsx";
import DirectoryCard from "./itemCards/DirectoryCard.tsx";
import NavigationBar from "./NavigationBar.tsx";

// Helper function to find a subdirectory by name
function findSubdirectory(current: DriveStructure, name: string): DriveStructure | null {
    return current.dirs.find((dir) => dir.name === name) || null;
}

export default function GoogleDriveApp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [snackMessage, setMessage] = useState<string>("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const [uploadFinishedFlag, setUploadFinishedFlag] = useState(false);

    const [rootStructure, setRootStructure] = useState<DriveStructure | null>(null);
    // We'll track our current location in the drive (could be root, or some subdirectory)
    const [currentStructure, setCurrentStructure] = useState<DriveStructure | null>(null);

    // A stack of folder names for navigation
    const [pathStack, setPathStack] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("");

    const handleClose = (
        _event?: SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleLogin = () => {
        check_credentials(
            {
                username: username,
                password: password
            }
        )
            .then(() => {
                setLoggedIn(true)
                localStorage.setItem("username", username);
            })
            .catch(err => {
                console.error(err);
                setLoggedIn(false);
                setOpen(true);
                setMessage("No such user!");
                setSeverity("error");
            });
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername("");
        setPassword("");
        setRootStructure(null);
        setCurrentStructure(null);
        setPathStack([]);
        setCurrentPath("/")
        localStorage.removeItem("bearerToken")
    };

    useEffect(() => {
        if (!loggedIn) return;

        const user = localStorage.getItem("username");
        if(!user) throw new Error("Could not retrieve user from local storage!");
        fetchDriveStructure(user)
            .then((r) => {
                const resultJson = r as DriveStructure;
                setRootStructure(resultJson);
                setCurrentStructure(resultJson);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [loggedIn, uploadFinishedFlag]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent the default browser behavior
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!loggedIn) return;

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Call the uploadFile method (assuming it exists)
                uploadFile(username, `${currentPath}/${file.name}`, file)
                    .then(() => {
                        setOpen(true);
                        setMessage(`File "${file.name}" uploaded successfully!`);
                        setSeverity("success");

                    })
                    .catch((err) => {
                        console.error(err);
                        setOpen(true);
                        setMessage(`Failed to upload "${file.name}".`);
                        setSeverity("error");
                    });
            }
            setUploadFinishedFlag(!uploadFinishedFlag);
        }
    };

    // Handler for clicking a folder card
    const openFolder = (folderName: string) => {
        if (!currentStructure) return;

        const subDir = findSubdirectory(currentStructure, folderName);
        if (subDir) {
            // Push folder name to path stack for back navigation
            setPathStack((prev) => [...prev, subDir.name]);
            setCurrentStructure(subDir);
            setCurrentPath((prev) => `${prev}/${subDir.name}`);
        }
    };

    // Handler for going back one directory
    const goBack = () => {
        if (!rootStructure || pathStack.length === 0) return;

        // Reconstruct the path from root, skipping the last folder
        const newStack = pathStack.slice(0, -1);

        let current: DriveStructure = rootStructure;
        for (const folderName of newStack) {
            const next = findSubdirectory(current, folderName);
            if (next) current = next;
        }
        setCurrentStructure(current);
        setPathStack(newStack);
        setCurrentPath(newStack.join("/") || "/");
    };

    if (!loggedIn) {
        return (
            <Box
                sx={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                }}
            >
                <Card sx={{ width: 400, p: 3, borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h5" mb={2} fontWeight="bold">
                        Login
                    </Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, borderRadius: 2 }}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                </Card>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        severity={severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                        onClose={handleClose}
                    >
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "md",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                margin: 0, // Ensure no margin
                padding: 0, // Ensure no padding
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <AppToolBar handleLogout={handleLogout} />

            <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#fafafa", py: 3 }}>
                <Container
                    maxWidth="md"
                    sx={{
                        bgcolor: "#fff",
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 2,
                        marginX: "auto",
                    }}
                >
                    {!currentStructure ? (
                        <Typography>Loading drive structure...</Typography>
                    ) : (
                        <>
                            {/* Navigation Bar */}
                            <NavigationBar pathStack={pathStack} currentStructure={currentStructure} goBack={goBack}/>

                            <Grid container spacing={3}>
                                {/* Sub-directories */}
                                {currentStructure.dirs.map((directory) => (
                                    <DirectoryCard directory={directory} openFolder={openFolder}/>
                                ))}

                                {/* Files */}
                                {currentStructure.files.map((file) => (
                                    <FileCard file={file}/>
                                ))}
                            </Grid>
                        </>
                    )}
                </Container>
            </Box>
        </Box>
    );
}