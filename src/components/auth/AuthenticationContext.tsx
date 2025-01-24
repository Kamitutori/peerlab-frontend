import React, {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

/**
 * This function provides the context for access control according to the login status.
 * This means, that if the user is not logged in, they cannot access dashboard,... and will be redirected to the login page.
 */

const AuthContext = React.createContext();
const AuthUpdateContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function useUpdateAuth() {
    return useContext(AuthUpdateContext);
}

export default function AuthProvider (children: any) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    const logIn = async (data: any) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            // TODO revise this section
            if (res.data) {
                setUser(res.data.user);
                setToken(res.token);
                localStorage.setItem("site", res.token);
                navigate("/dashboard");
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut= () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={token}>
            <AuthUpdateContext.Provider value={setToken}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    );
}



//export default AuthProvider;