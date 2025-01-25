import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    Card,
    Container,
    Grid,
    TextField,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveStructure from "../models/DriveStructure";
import {check_credentials} from "../logic/login.ts";

// Helper function to find a subdirectory by name
function findSubdirectory(current: DriveStructure, name: string): DriveStructure | null {
    return current.dirs.find((dir) => dir.name === name) || null;
}

export default function GoogleDriveApp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [rootStructure, setRootStructure] = useState<DriveStructure | null>(null);
    // We'll track our current location in the drive (could be root, or some subdirectory)
    const [currentStructure, setCurrentStructure] = useState<DriveStructure | null>(null);

    // A stack of folder names for navigation
    const [pathStack, setPathStack] = useState<string[]>([]);

    const handleLogin = () => {
        check_credentials(
            {
                username: username,
                password: password
            }
        )
            .then(() => setLoggedIn(true))
            .catch(err => {
                console.error(err);
                setLoggedIn(false);
                // TODO: Add snack notification
            });
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername("");
        setPassword("");
        setRootStructure(null);
        setCurrentStructure(null);
        setPathStack([]);
    };

    // Mock drive fetch after login
    useEffect(() => {
        if (!loggedIn) return;

        // Simulate async fetch
        setTimeout(() => {
            const mockRoot: DriveStructure = {
                name: "adonev",
                files: ["n.png", "document.pdf"],
                dirs: [
                    {
                        name: "test",
                        files: ["test.txt", "test2.txt"],
                        dirs: [],
                    },
                ],
            };
            setRootStructure(mockRoot);
            setCurrentStructure(mockRoot);
        }, 800);
    }, [loggedIn]);

    // Handler for clicking a folder card
    const openFolder = (folderName: string) => {
        if (!currentStructure) return;

        const subDir = findSubdirectory(currentStructure, folderName);
        if (subDir) {
            // Push folder name to path stack for back navigation
            setPathStack((prev) => [...prev, subDir.name]);
            setCurrentStructure(subDir);
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
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My Drive
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <Typography>Logout</Typography>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#fafafa", py: 3 }}>
                <Container
                    maxWidth="md"
                    sx={{
                        bgcolor: "#fff",
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 2,
                        // Center the container horizontally
                        marginX: "auto",
                    }}
                >
                    {!currentStructure ? (
                        <Typography>Loading drive structure...</Typography>
                    ) : (
                        <>
                            {/* Navigation Bar */}
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

                            <Grid container spacing={3}>
                                {/* Sub-directories */}
                                {currentStructure.dirs.map((directory) => (
                                    <Grid item xs={12} sm={6} md={4} key={directory.name}>
                                        <Card
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
                                            onClick={() => openFolder(directory.name)}
                                        >
                                            <FolderIcon sx={{ fontSize: 36, color: "#1976d2" }} />
                                            <Typography mt={1} fontWeight="medium">
                                                {directory.name}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}

                                {/* Files */}
                                {currentStructure.files.map((file) => (
                                    <Grid item xs={12} sm={6} md={4} key={file}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                height: 150,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 3,
                                                boxShadow: 1,
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.03)",
                                                    boxShadow: 4,
                                                },
                                            }}
                                        >
                                            <DescriptionIcon sx={{ fontSize: 36, color: "#888" }} />
                                            <Typography mt={1}>{file}</Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </Container>
            </Box>
        </Box>
    );
}