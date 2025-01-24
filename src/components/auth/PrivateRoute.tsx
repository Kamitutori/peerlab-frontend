import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthenticationContext.tsx";

const PrivateRoute = () => {
    const user = useAuth();
    if (!user.token) {
        return <Navigate to="/login"/>;
    }
    return <Outlet />;
};

export default PrivateRoute;