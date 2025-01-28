// TODO Meaningful login failure messages have to be implemented
/**
 * This function provides the context for access control according to the login status.
 * This means, that if the user is not logged in, they cannot access dashboard,... and will be redirected to the login page.
 */
import React, {
    createContext,
    useContext,
    useState
} from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    email: string;
    password: string;
}

type AuthContextType = {
    token: string;
    user: User | null;
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
    const [token, setToken] = useState<string>(localStorage.getItem("jwt") || "");
    const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null);
    const navigate = useNavigate();

    const login = async (data: { email: string; password: string }) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            console.log(res);
            if (response.ok) {
                setToken(res.token);
                setUser(res.user);
                localStorage.setItem("jwt", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
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
        localStorage.removeItem("jwt");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{token, user }}>
            <AuthUpdateContext.Provider value={{ login, logout }}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    );
}
