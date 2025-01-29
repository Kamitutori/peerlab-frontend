import PaperList from "../components/PaperList.tsx";
import Box from "@mui/material/Box";

export default function Dashboard() {

    if (!localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/login";
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <PaperList
                endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                title={"My Recent Papers"} />
        </Box>
    );
}
