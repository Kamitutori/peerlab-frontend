import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import PaperList from "../components/PaperList.tsx";
import RequestListOfPapers from "../components/RequestListOfPapers.tsx";
import {Grid2} from "@mui/material";
import ReviewList from "../components/ReviewList.tsx";

export default function Dashboard() {
    const navigate = useNavigate();

    if (!localStorage.getItem("jwt")) {
        navigate("/login");
    }

    return (
        <Box sx={{flexGrow: 1, padding: 4}}>
            <PaperList
                endpoint={`http://localhost:8080/api/papers`}
                title={"My Recent Papers"}
            />
            <Grid2 container spacing={4} justifyContent="center">
                <RequestListOfPapers
                    endpoint={`http://localhost:8080/api/requests?status=PENDING`}
                    title={"Pending Requests"}
                />
                <Grid2>
                    <ReviewList
                        endpoint={'http:localhost:8080/api/reviews'}
                        title={"Reviews to do"}
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
}