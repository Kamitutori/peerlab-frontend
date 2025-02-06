import {useState} from "react";
import {Checkbox, Divider, FormControlLabel, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";

import RequestListOfPapers from "../components/RequestListOfPapers.tsx";

// Default export of MyReviewsPage component, representing the user's request and review page
export default function MyReviewsPage() {
    // State to control whether expired/rejected requests should be displayed
    const [showExpiredRejected, setShowExpiredRejected] = useState(false);

    return (
        // Paper component for the main container with styling
        <Paper
            sx={{
                marginTop: 10,
                marginBottom: 5,
                border: '1px solid #777',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
            {/* Displaying the page title */}
            <Typography variant={"h4"} fontWeight={"bold"} sx={{mt: 5, mb: 2}}>
                My Reviews
            </Typography>
            <Divider sx={{width: "80%"}}/>
            <Box sx={{flexGrow: 1, marginLeft: 4, marginRight: 4, marginBottom: 4}}>
                {/* RequestListOfPapers component to display pending requests */}
                <RequestListOfPapers
                    endpoint={`http://localhost:8080/api/requests?status=PENDING`} // Endpoint for fetching pending paper requests
                    title="Pending Requests" // Title for the section
                />
                <Grid2 container spacing={4} justifyContent={"center"}>
                    {/* RequestListOfPapers component to display accepted reviews */}
                    <Grid2>
                        <RequestListOfPapers
                            endpoint={`http://localhost:8080/api/requests?status=ACCEPTED`} // Endpoint for accepted paper requests
                            title="Reviews to do" // Title for the section
                            width={500}
                            height={300}
                        />
                    </Grid2>
                    {/* RequestListOfPapers component to display submitted reviews */}
                    <Grid2>
                        <RequestListOfPapers
                            endpoint={`http://localhost:8080/api/requests?status=SUBMITTED`} // Endpoint for submitted paper requests
                            title="Submitted Reviews" // Title for the section
                            width={500}
                            height={300}
                        />
                    </Grid2>
                </Grid2>

                {/* Checkbox to toggle displaying expired and rejected reviews */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showExpiredRejected}
                            onChange={(e) => setShowExpiredRejected(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Show Expired/Rejected Reviews"
                    sx={{mt: 2}}
                />
                {/* If the checkbox is checked, display the expired and rejected reviews */}
                {showExpiredRejected && (
                    <Grid2 container spacing={4} justifyContent={"center"}>
                        {/* RequestListOfPapers component to display rejected requests */}
                        <Grid2>
                            <RequestListOfPapers
                                endpoint={`http://localhost:8080/api/requests?status=REJECTED`} // Endpoint for rejected paper requests
                                title="Rejected Requests" // Title for the section
                                width={500}
                                height={300}
                            />
                        </Grid2>
                        {/* RequestListOfPapers component to display expired requests */}
                        <Grid2>
                            <RequestListOfPapers
                                endpoint={`http://localhost:8080/api/reviews?status=EXPIRED`} // Endpoint for expired reviews
                                title="Expired Requests" // Title for the section
                                width={500}
                                height={300}
                            />
                        </Grid2>
                    </Grid2>
                )}
            </Box>
        </Paper>
    )
        ;
}