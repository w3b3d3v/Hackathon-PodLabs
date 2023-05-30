import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

export default function AlertInformation({textAlert, textAlertError , handleButtonClick, buttonState}) {
    const [openInformartion, setOpenInformartion] = useState(false);
    const [openError, setOpenError] = useState(false);

    const handleCloseSnackInformation = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenInformartion(false);
    };

    const handleCloseSnackError = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };


    return (
        <>
            <Snackbar open={openInformartion} autoHideDuration={6000} onClose={handleCloseSnackInformation}>
                <Alert onClose={handleCloseSnackInformation} severity="info" sx={{ width: '100%' }}>
                    {textAlert}
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseSnackError}>
                <Alert onClose={handleCloseSnackError} severity="error" sx={{ width: '100%' }}>
                    {textAlertError}
                </Alert>
            </Snackbar>
        </>
    )
}