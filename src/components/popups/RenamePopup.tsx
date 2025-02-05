import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React from "react";

type SimplePopupProps = {
    open: boolean;
    handleClose: () => void;
    handleOpen: () => void;
    handleSubmit: (new_name: string) => void;
    focusedFile: string;
};

export default function SimplePopup(props: SimplePopupProps) {

    const [textFieldValue, setTextFieldValue] = React.useState<string>(props.focusedFile);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="rename-dialog-title"
                aria-describedby="rename-dialog-description"
                sx={{
                    minWidth: '25%',       // Set the width to 10% of the viewport
                    minHeight: '15%',    // Set the minimum height to 7% of the viewport
                }}
            >
                <DialogTitle id="rename-dialog-title">Rename Item</DialogTitle>
                <DialogContent>
                    <TextField
                        id="outlined-basic"
                        label="Outlined"
                        variant="outlined"
                        fullWidth
                        value={textFieldValue}
                        onChange={(e) => setTextFieldValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Cancel</Button>
                    <Button onClick={() => props.handleSubmit(textFieldValue)} variant="contained" color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}