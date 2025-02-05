import {useState} from "react";
import {Checkbox, Divider, FormControlLabel, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import RequestListOfPapers from "../components/RequestListOfPapers.tsx";

export default function MyReviewsPage() {
    const [showExpiredRejected, setShowExpiredRejected] = useState(false);

    return (
        <Paper
            sx={{
                marginTop: 10,
                marginBottom: 5,
                border: '1px solid #777',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
            <Typography variant={"h4"} fontWeight={"bold"} sx={{mt: 5, mb: 2}}>
                My Reviews
            </Typography>
            <Divider sx={{width: "80%"}}/>
            <Box sx={{flexGrow: 1, marginLeft: 4, marginRight: 4, marginBottom: 4}}>
                <RequestListOfPapers
                    endpoint={`http://localhost:8080/api/requests?status=PENDING`}
                    title="Pending Reviews"
                />
                <Grid2 container spacing={4} justifyContent={"center"}>
                    <Grid2>
                        <RequestListOfPapers
                            endpoint={`http://localhost:8080/api/requests?status=ACCEPTED`}
                            title="Accepted Reviews"
                            width={500}
                            height={300}
                        />
                    </Grid2>
                    <Grid2>
                        <RequestListOfPapers
                            endpoint={`http://localhost:8080/api/requests?status=SUBMITTED`}
                            title="Submitted Reviews"
                            width={500}
                            height={300}
                        />
                    </Grid2>
                </Grid2>
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
                {showExpiredRejected && (
                    <Grid2 container spacing={4} justifyContent={"center"}>
                        <Grid2>
                            <RequestListOfPapers
                                endpoint={`http://localhost:8080/api/requests?status=REJECTED`}
                                title="Rejected Reviews"
                                width={500}
                                height={300}
                            />
                        </Grid2>
                        <Grid2>
                            <RequestListOfPapers
                                endpoint={`http://localhost:8080/api/reviews?status=EXPIRED`}
                                title="Reviews"
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