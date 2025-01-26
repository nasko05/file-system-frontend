import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";

type AppToolBarProps = {
    handleLogout: () => void;
}

export default function AppToolBar({ handleLogout }: AppToolBarProps){
    return (
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" sx={{flexGrow: 1}}>
                My Drive
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
                <Typography>Logout</Typography>
            </IconButton>
        </Toolbar>
    </AppBar>
    )
}

