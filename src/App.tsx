import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import AuthProvider from "./components/auth/AuthenticationContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import { darkTheme, lightTheme } from "./theme";

import LoginPage from "./pages/auth/LoginPage.tsx";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/ProfilePage";
import MyPapersPage from "./pages/MyPapersPage.tsx";
import MyReviewsPage from "./pages/MyReviewsPage.tsx";
import NoPage from "./pages/NoPage";
import TopMenuBar from "./components/TopBar";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SinglePaper from "./components/SinglePaper.tsx";
import EditPaperPage from "./pages/EditPaperPage.tsx";
import PaperList from "./components/PaperList.tsx";
import AddPaperPage from "./pages/AddPaperPage.tsx";
import AddReviewPage from "./pages/AddReviewPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import EditReviewPage from "./pages/EditReviewPage.tsx";
import AlertDialogProvider from "./components/AlertDialogProvider.tsx";


const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1d1d1d',
        },

    },
    typography: {
        fontFamily: 'Source Sans 3, sans-serif',
    },
    components: {
        MuiTextField: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#606060",
                            borderWidth: "2px",
                        },
                        "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#646cff",
                                borderWidth: "2px",
                            },
                        },
                        "&:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#b5b5b5",
                            },
                        },
                        "& .MuiOutlinedInput-input": {
                            color: "#fff"
                        }
                    },
                    "& .MuiInputLabel-outlined": {
                        color: "#bcbcbc",
                        "&.Mui-focused": {
                            color: "primary",
                            fontWeight: "bold",
                        },
                    }
                }
            }
        }
    }
});

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    const toggleTheme = () => {
        setIsDarkMode((prevMode: boolean) => {
            const newMode = !prevMode;
            localStorage.setItem('theme', JSON.stringify(newMode));
            return newMode;
        });
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(JSON.parse(savedTheme));
        }
    }, []);

    return (
        <div>
            <BrowserRouter>
                <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                    <CssBaseline />
                    <AuthProvider>
                        <AlertDialogProvider>
                            <div className="container">
                                <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                                <Routes>
                                    {/* Public Routes */}
                                    <Route
                                        index
                                        element={
                                            <LoginPage/>
                                        }
                                    />
                                    <Route
                                        path="/login"
                                        element={
                                            <LoginPage/>
                                        }
                                    />
                                    <Route
                                        path="/register"
                                        element={
                                            <RegisterPage/>
                                        }
                                    />
                                    <Route
                                        path="/forgot-password"
                                        element={
                                            <ForgotPassword/>
                                        }
                                    />

                                {/* Private Routes with TopMenuBar */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <Dashboard/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <ProfilePage />
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/papers"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <MyPapersPage/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/reviews"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <MyReviewsPage/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <PaperList endpoint="/api/papers" title="Papers"/>
                                            </>
                                        </PrivateRoute>
                                    }

                                />
                                <Route
                                    path="/paper/:id"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <SinglePaper/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/edit-paper/:id"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <EditPaperPage/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/add-paper"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <AddPaperPage/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/add-review"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <AddReviewPage/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/edit-review"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <EditReviewPage/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                {/* Fallback Route */}
                                <Route path="*" element={<NoPage/>}/>
                            </Routes>
                        </div>
                        </AlertDialogProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;