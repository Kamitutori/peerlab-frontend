import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import PaperList from "../components/PaperList.tsx";
import RequestListOfPapers from "../components/RequestListOfPapers.tsx";
import {Divider, Grid2, Typography} from "@mui/material";
import ReviewList from "../components/ReviewList.tsx";
import Paper from "@mui/material/Paper";

export default function Dashboard() {
    const navigate = useNavigate();

    if (!localStorage.getItem("jwt")) {
        navigate("/login");
    }

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
                Dashboard
            </Typography>
            <Divider sx={{width: "80%"}}/>
            <Box sx={{flexGrow: 1, marginLeft: 4, marginRight: 4, marginBottom: 4}}>
                <PaperList
                    endpoint={`http://localhost:8080/api/papers`}
                    title={"My Recent Papers"}
                    height={300}
                />
                <Grid2 container spacing={4} justifyContent="center">
                    <RequestListOfPapers
                        endpoint={`http://localhost:8080/api/requests?status=PENDING`}
                        title={"Pending Requests"}
                        width={500}
                        height={300}
                    />
                    <Grid2>
                        <ReviewList
                            endpoint={'http://localhost:8080/api/reviews'}
                            title={"Reviews to do"}
                            width={500}
                            height={300}
                        />
                    </Grid2>
                </Grid2>
            </Box>
        </Paper>
    );
}