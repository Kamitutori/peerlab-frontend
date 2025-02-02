import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import AuthProvider from "./components/auth/AuthenticationContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import { darkTheme, lightTheme } from "./theme";

import LoginPage from "./pages/auth/LoginPage.tsx";
import Dashboard from "./pages/Dashboard";
import MyPapersPage from "./pages/MyPapersPage.tsx";
import MyReviewsPage from "./pages/MyReviewsPage.tsx";
import NoPage from "./pages/NoPage";
import TopMenuBar from "./components/TopBar";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EditPaperPage from "./pages/EditPaperPage.tsx";
import PaperList from "./components/PaperList.tsx";
import AddPaperPage from "./pages/AddPaperPage.tsx";
import AddReviewPage from "./pages/AddReviewPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import EditReviewPage from "./pages/EditReviewPage.tsx";
import AlertDialogProvider from "./components/AlertDialogProvider.tsx";

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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
                                                    <ProfilePage/>
                                                </>
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/papers"
                                        element={
                                            <PrivateRoute>
                                                <>
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
                                                    <PaperList endpoint="/api/papers" title="Papers"/>
                                                </>
                                            </PrivateRoute>
                                        }

                                    />
                                    <Route
                                        path="/edit-paper/:id"
                                        element={
                                            <PrivateRoute>
                                                <>
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
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
                                                    <TopMenuBar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
                                                    <EditReviewPage/>
                                                </>
                                            </PrivateRoute>
                                        }
                                    />
                                    {/* Fallback Route */}
                                    <Route path="*" element={<NoPage />} />
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