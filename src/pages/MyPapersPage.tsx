import PaperList from "../components/PaperList";
import {Box, Divider, Fab, Grid2, Paper, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";

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
    const currentPapersFilter = (paper: Paper) => {
        return paper.reviewCount < (paper.reviewLimit ?? Infinity);
    };
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
                My Papers
            </Typography>
            <Divider sx={{width: "80%"}}/>
            <Box sx={{flexGrow: 1, marginLeft: 4, marginRight: 4, marginBottom: 4}}>
                <PaperList
                    endpoint={`http://localhost:8080/api/papers`}
                    title={"Recently Reviewed"}
                    height={300}
                />
                <Grid2 container spacing={4} justifyContent="center">
                    <Grid2>
                        <PaperList
                            endpoint={`http://localhost:8080/api/papers`}
                            title="Current Papers"
                            filter={currentPapersFilter}
                            width={500}
                            height={300}
                        />
                    </Grid2>
                    <Grid2>
                        <PaperList
                            endpoint={`http://localhost:8080/api/papers`}
                            title="Finished Papers"
                            filter={finishedPapersFilter}
                            width={500}
                            height={300}
                        />
                    </Grid2>
                </Grid2>
                <Fab
                    variant={"extended"}
                    color={"primary"}
                    sx={{position: "fixed", bottom: 16, right: 16}}
                    onClick={handleAddPaperClick}
                >
                    <AddIcon/>
                    Add Paper
                </Fab>
            </Box>
        </Paper>
    );
}