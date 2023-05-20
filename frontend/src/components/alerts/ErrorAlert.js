import React from 'react';
import {Alert, Snackbar} from "@mui/material";

const ErrorAlert = ({ error, setError }) => {
    if(typeof error === undefined) {
        error = "Something went wrong"
    }
    return (
        <Snackbar
            open={!!error}
            autoHideDuration={5000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert severity="error" sx={{ width: '100%', marginTop: '100px' }}>{error}</Alert>
        </Snackbar>
    );
};

export default ErrorAlert;