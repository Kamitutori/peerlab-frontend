import {useNavigate} from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    if (!localStorage.getItem("jwt")) {
        navigate("/login");
    }

    return (
        <>
            <h1>Dashboard</h1>
        </>
    );
}
