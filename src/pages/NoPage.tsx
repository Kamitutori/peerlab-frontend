import Paper from "@mui/material/Paper";

// This is the default export of the NoPage component which will be displayed for a 404 error.
export default function NoPage() {
    return (
        <div>
            {/* Using the Paper component from Material-UI */}
            <Paper sx={{ padding: 4 }}>
                {/* Displaying the error message for 404: Not Found */}
                <h1>Error 404: Not Found</h1>
            </Paper>
        </div>
    )
}