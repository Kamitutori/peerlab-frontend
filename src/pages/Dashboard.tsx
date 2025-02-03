import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import PaperList from "../components/PaperList.tsx";

export default function Dashboard() {
    const navigate = useNavigate();

    if (!localStorage.getItem("jwt")) {
        navigate("/login");
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <PaperList
                endpoint={`http://localhost:8080/api/papers`}
                title={"My Recent Papers"} />
        </Box>
    );
}
