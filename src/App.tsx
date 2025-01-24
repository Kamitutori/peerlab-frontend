/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
*/

import './App.css'

import Login from './pages/Login'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import MyPapers from "./pages/MyPapers.tsx";
import MyReviews from "./pages/MyReviews.tsx";
import NoPage from "./pages/NoPage.tsx";
import TopMenuBar from "./components/TopBar.tsx";
import SinglePaper from "./components/SinglePaper.tsx";
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import PrivateRoute from "./components/auth/PrivateRoute.tsx";
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
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
                                borderColor: "#7e3ff2",
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
                {/* <AuthProvider children={Login}> */}
                    <TopMenuBar/>
                    <div className="container">
                        <Routes>
                            <Route index element={<Login/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                            </Route>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/papers" element={<MyPapers/>}/>
                                <Route path="/reviews" element={<MyReviews/>}/>
                                <Route path="/single-paper" element={<SinglePaper/>}/>

                            <Route path="*" element={<NoPage/>}/>
                        </Routes>
                    </div>
                {/* </AuthProvider> */}
                    </ThemeProvider>
            </BrowserRouter>
        </div>
    )
}

export default App
