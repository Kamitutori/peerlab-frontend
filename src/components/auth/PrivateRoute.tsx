import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthenticationContext.tsx";

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
