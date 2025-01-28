import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import AuthProvider from "./components/auth/AuthenticationContext";
import PrivateRoute from "./components/auth/PrivateRoute";

import LoginPage from "./pages/LoginPage.tsx";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyPapers from "./pages/MyPapers";
import MyReviews from "./pages/MyReviews";
import NoPage from "./pages/NoPage";
import TopMenuBar from "./components/TopBar";
import RegisterPage from "./pages/RegisterPage.tsx";
import ForgotPassword from "./pages/ForgotPassword";
import SinglePaper from "./components/SinglePaper.tsx";
import EditPaper from "./pages/EditPaper.tsx";
import PaperList from "./components/PaperList.tsx";

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
    return (
        <div>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <AuthProvider>
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
                                                <Profile/>
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
                                                <MyPapers/>
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
                                                <MyReviews/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="/" element={<PaperList endpoint="/api/papers" title="Papers" />} />
                                <Route path="/paper/:id" element={<SinglePaper />} />
                                <Route
                                    path="/edit-paper"
                                    element={
                                        <PrivateRoute>
                                            <>
                                                <TopMenuBar/>
                                                <EditPaper/>
                                            </>
                                        </PrivateRoute>
                                    }
                                />
                                {/* Fallback Route */}
                                <Route path="*" element={<NoPage/>}/>
                            </Routes>
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
