// TODO Meaningful login failure messages have to be implemented
/**
 * This function provides the context for access control according to the login status.
 * This means, that if the user is not logged in, they cannot access dashboard,... and will be redirected to the login page.
 */
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
/*
type User = {
    id: number;
    name: string;
    email: string;
} | null;
*/
type AuthContextType = {
    token: string;
    //user: User;
};

type AuthUpdateContextType = {
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const AuthUpdateContext = createContext<AuthUpdateContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

export function useUpdateAuth() {
    const context = useContext(AuthUpdateContext);
    if (!context) throw new Error("useUpdateAuth must be used within an AuthProvider");
    return context;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [token, setToken] = useState<string>(localStorage.getItem("jwt") || "");
    //const [user, setUser] = useState<User>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);

    const login = async (data: { email: string; password: string }) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const res = await response.text();
            //const res = await response.json();
            if (response.ok) {
                //const { token, user} = res;
                setToken(res);
                //setToken(token);
                //setUser(user);
                localStorage.setItem("jwt", res);
                //localStorage.setItem("user", JSON.stringify(user));
                navigate("/dashboard");
            } else if (response.status === 400) {
                alert("Invalid email or password.");
            }
        } catch (error) {
            console.error("LoginPage error:", error);
            alert("LoginPage failed. Please try again.");
        }
    };

    const logout = () => {
        setToken("");
        //setUser(null);
        localStorage.removeItem("jwt");
        //localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{token, /* user */ }}>
            <AuthUpdateContext.Provider value={{ login, logout }}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    );
}
