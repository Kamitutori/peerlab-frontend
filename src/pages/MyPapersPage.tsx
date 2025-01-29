import PaperList from "../components/PaperList";
import {Box, Fab, Grid2} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";

export default function MyPapersPage() {
    const navigate = useNavigate();
    const handleAddPaperClick = () => {
        navigate('/add-paper');
    }
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <PaperList
                endpoint={`http://localhost:8080/api/papers`}
                title={"Recently Reviewed"} />
            <Grid2 container spacing={4} justifyContent="center">
                <Grid2>
                    <PaperList
                        endpoint={`http://localhost:8080/api/papers`}
                        title="Current Papers"
                    />
                </Grid2>
                <Grid2>
                    <PaperList
                        endpoint={`http://localhost:8080/api/papers`}
                        title="Finished Papers"
                    />
                </Grid2>
            </Grid2>
            <Fab
                variant={"extended"}
                color={"primary"}
                sx={{position: "fixed", bottom: 16, right: 16}}
                onClick={handleAddPaperClick}
            >
                <AddIcon />
                Add Paper
            </Fab>
        </Box>
    );
}