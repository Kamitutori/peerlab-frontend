// TODO: Implement MyPapers
import PaperList from "../components/PaperList.tsx";
import {Box, Grid2, Typography} from "@mui/material";

export default function MyPapers() {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
                Papers
            </Typography>
            <Grid2 container spacing={4} justifyContent="center">
                <Grid2>
                    <PaperList />
                </Grid2>
                <Grid2>
                    <PaperList />
                </Grid2>
            </Grid2>
        </Box>
    );
}