import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthenticationContext.tsx";

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { token, user } = useAuth();

    if (!token || !user) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
