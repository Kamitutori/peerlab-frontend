import PaperList from "../components/PaperList";
import { Box, Grid } from "@mui/material";

export default function MyPapers() {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <PaperList
                endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                title={"Recently Reviewed"} />
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <PaperList
                        endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                        title="Current Papers"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PaperList
                        endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                        title="Finished Papers"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}