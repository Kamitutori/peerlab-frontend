// TODO: Implement MyPapers
import PaperList from "../components/PaperList.tsx";
import {Box, Grid2} from "@mui/material";

export default function MyPapers() {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <PaperList
                endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                title={"Recently Reviewed"} />
            <Grid2 container spacing={4} justifyContent="center">
                <Grid2>
                    <PaperList
                    endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                    title="Current Papers"
                    />
                </Grid2>
                <Grid2>
                    <PaperList
                    endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                    title="Finished Papers"
                    />
                </Grid2>
            </Grid2>
        </Box>
    );
}