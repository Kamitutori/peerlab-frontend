import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import PaperList from "../components/PaperList.tsx";
import RequestListOfPapers from "../components/RequestListOfPapers.tsx";
import {Divider, Grid2, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";

// Default export of Dashboard component, representing the user's dashboard page
export default function Dashboard() {
    // Initializing the navigate function from the react-router-dom hook to allow page navigation
    const navigate = useNavigate();

    // Redirect to the login page if no JWT token is found in localStorage
    if (!localStorage.getItem("jwt")) {
        navigate("/login");
    }

    return (
        // Using Paper component to create a styled container for the dashboard content
        <Paper
            sx={{
                marginTop: 10,
                marginBottom: 5,
                border: '1px solid #777',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
        }}>
            {/* Displaying the title of the dashboard */}
            <Typography variant={"h4"} fontWeight={"bold"} sx={{mt: 5, mb: 2}}>
                Dashboard
            </Typography>
            {/* Divider to separate sections visually */}
            <Divider sx={{width: "80%"}}/>

            {/* Main content area with some padding and spacing */}
            <Box sx={{flexGrow: 1, marginLeft: 4, marginRight: 4, marginBottom: 4}}>
                {/* PaperList component to display a list of recent papers, passing an endpoint, title, and height */}
                <PaperList
                    endpoint={`http://localhost:8080/api/papers`}
                    title={"My Recent Papers"}
                    height={300}
                />
                {/* Grid2 component for laying out the requests in two columns */}
                <Grid2 container spacing={4} justifyContent="center">
                    {/* RequestListOfPapers component to display pending requests */}
                    <RequestListOfPapers
                        endpoint={`http://localhost:8080/api/requests?status=PENDING`}
                        title={"Pending Requests"}
                        width={500}
                        height={300}
                    />
                    <Grid2>
                        {/* Another RequestListOfPapers component to display accepted requests (reviews to do) */}
                        <RequestListOfPapers
                            endpoint={`http://localhost:8080/api/requests?status=ACCEPTED`}
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