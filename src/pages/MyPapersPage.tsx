import PaperList from "../components/PaperList";
import { Box, Fab, Grid2 } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

// Define a type for the paper object
interface Paper {
    id: number;
    title: string;
    owner: {
        name: string;
    };
    reviewCount: number;
    reviewLimit: number;
}

export default function MyPapersPage() {
    const navigate = useNavigate();
    const handleAddPaperClick = () => {
        navigate('/add-paper');
    }

    // Use the defined type for the paper object
    const finishedPapersFilter = (paper: Paper) => paper.reviewCount === paper.reviewLimit;
    const currentPapersFilter = (paper: Paper) => paper.reviewCount < paper.reviewLimit;

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
                        filter={currentPapersFilter}
                    />
                </Grid2>
                <Grid2>
                    <PaperList
                        endpoint={`http://localhost:8080/api/papers`}
                        title="Finished Papers"
                        filter={finishedPapersFilter}
                    />
                </Grid2>
            </Grid2>
            <Fab
                variant={"extended"}
                color={"primary"}
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                onClick={handleAddPaperClick}
            >
                <AddIcon />
                Add Paper
            </Fab>
        </Box>
    );
}