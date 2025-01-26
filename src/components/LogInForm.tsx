import {Alert, AlertColor, Box, Button, Card, Snackbar, TextField, Typography} from "@mui/material";
import React from "react";

type LogInFormProps = {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    handleLogin: () => void;
    handleClose: () => void;
    snackMessage: string;
    severity: AlertColor;
}

export default function LogInForm(props: LogInFormProps) {
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
                    value={props.username}
                    onChange={(e) => props.setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={props.password}
                    onChange={(e) => props.setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={props.handleLogin}
                >
                    Sign In
                </Button>
            </Card>
            <Snackbar
                open={props.open}
                autoHideDuration={6000}
                onClose={props.handleClose}
            >
                <Alert
                    severity={props.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                    onClose={props.handleClose}
                >
                    {props.snackMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}