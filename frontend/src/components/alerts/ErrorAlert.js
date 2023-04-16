import React from 'react';
import {Alert, Snackbar} from "@mui/material";

const ErrorAlert = ({ error, setError }) => {
    return (
        <Snackbar
            open={!!error}
            autoHideDuration={5000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
    );
};

export default ErrorAlert;