import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

type SimplePopupProps = {
    open: boolean;
    handleClose: () => void;
    handleOpen: () => void;
    handleSubmit: () => void;
};

export default function SimplePopup(props: SimplePopupProps) {

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="rename-dialog-title"
                aria-describedby="rename-dialog-description"

            >
                <DialogTitle id="rename-dialog-title">Rename Item</DialogTitle>
                <DialogContent>
                    <TextField
                        id="outlined-basic"
                        label="Outlined"
                        variant="outlined"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Cancel</Button>
                    <Button onClick={props.handleSubmit} variant="contained" color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}