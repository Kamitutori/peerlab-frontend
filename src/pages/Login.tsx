import {
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import {redirect} from "react-router-dom";
import React, {useState} from "react";
import peerLabLogoTransparent from "../assets/peerlabLogo_transparent.svg";
import {useQuery} from "@tanstack/react-query";

function goToRegister() {
    window.location.href = "http://localhost:5173/register";
    redirect("/register");
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const {data, refetch} =
        useQuery({
            queryKey: ['login'],
            queryFn: async () => {
                console.log("Submitting...");
                const res = await fetch("http://localhost:8080/api/auth/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: input.email,
                        password: input.password,
                    })
                })
                return (await res.json());
            },
            enabled: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retryOnMount: false,
            retry: 0
        })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(input);
    };

    // TODO: useful checks and fitting error treatment; JWT storage
    const loginToApplication = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {email, password} = {
            email: input.email,
            password: input.password,
        };
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        refetch();


        if (data !== undefined) {
            if (data.get('status') === 200) {
                console.log('Success!');
                //Store token
                redirect('/dashboard');
            } else {
                alert(`Failed to register: ${data.get('message')}`);
                console.log(data.get('status'), JSON.stringify(data.error));
            }
        }

    }

    return (
        <Box>
            <Paper sx={{bgcolor: "#333"}} elevation={4} square={false}>
                <form onSubmit={loginToApplication}>
                    <Stack rowGap={1} paddingX={6} paddingY={2}
                           direction="column"
                           spacing={0.5}
                           sx={{
                               justifyContent: "center",
                               alignItems: "center",
                           }}
                    >
                        <img src={peerLabLogoTransparent}
                             alt="PeerLab logo"
                             style={{height: 100, width: 100}}
                        />
                        <h1 style={{color: "#fff"}}>Login</h1>
                        <div></div>
                        <TextField
                            id="email-input"
                            name="email"
                            label="Email"
                            onChange={handleInput}
                        >
                        </TextField>
                        <TextField
                            id="password-input"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleInput}
                        >
                        </TextField>
                        <FormControlLabel
                            style={{color: "#b5b5b5"}}
                            label="Show Password"
                            control={
                                <Checkbox style={{color: "#cdcdcd"}}
                                          onChange={() => setShowPassword(!showPassword)}/>
                            }
                        />
                        <Button
                            id="login"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={goToRegister}
                        >
                            Register
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}


/*
import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import {Button, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvidee } from '@toolpad/core/SignInPage'


import * as React from 'react';
import {
    Button,
    FormControl,
    //FormControlLabel,
    //Checkbox,
    InputLabel,
    OutlinedInput,
    TextField,
    InputAdornment,
    Link,
    Alert,
    IconButton, createTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import {AuthProvider, SignInPage} from '@toolpad/core/SignInPage';
import peerLabLogoTransparent from '../assets/peerlabLogo_transparent.svg';
import {useQuery} from "@tanstack/react-query";

const providers = [{ id: 'credentials', name: 'Email and Password' }];

const BRANDING = {
    logo: (
        <img
            src={peerLabLogoTransparent}
            alt="PeerLab logo"
            style={{ height: 100, width: 100 }}
        />
    ),
    title: 'PeerLab',
};

function CustomEmailField() {
    return (
        <TextField
            id="input-with-icon-textfield"
            label="Email"
            name="email"
            type="email"
            size="small"
            fullWidth
            variant="outlined"
        />
    );
}

function CustomPasswordField() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    return (
        <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
            <InputLabel size="small" htmlFor="outlined-adornment-password">
                Password
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                size="small"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                        >
                            {showPassword ? (
                                <VisibilityOff fontSize="inherit" />
                            ) : (
                                <Visibility fontSize="inherit" />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
}

function CustomLoginButton() {
    return (
        <Button
            type="submit"
            variant="outlined"
            color="info"
            size="small"
            disableElevation
            fullWidth
            sx={{ my: 2 }}
        >
            Log In
        </Button>
    );
}

function SignUpLink() {
    return (
        <Link href="/register" variant="body2">
            Sign up
        </Link>
    );
}

function ForgotPasswordLink() {
    return (
        <Link href="/forgot-password" variant="body2">
            Forgot password?
        </Link>
    );
}

function Title() {
    return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

function Subtitle() {
    return (
        <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="error">
            No functionality yet...
        </Alert>
    );
}

export default function SlotsSignIn() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: { default: '#333' },
            primary: { main: '#5567d6' },
        },
    });

    function handleSignIn(_provider: AuthProvider, formData: FormData) {
        console.log(`Hi!`)
        const {data: responseData} = useQuery({
            queryKey: ['login'],
            queryFn: async () => {
                const res = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        // Set host and Authorization...
                        'host': 'localhost:8080',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.get('email'),
                        password: formData.get('password'),
                    })
                });
                return (await res.json());}
        });
        if (responseData.get('status') === 200) {
            alert('Success!');
            //redirect('/dashboard');
        }

    }

    return (
        <AppProvider branding={BRANDING} theme={darkTheme}>
            <SignInPage
                signIn={(provider, formData) =>
                    handleSignIn(provider, formData)

                    //alert(`Logging in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}, and checkbox value: ${formData.get('tandc')}.`,)
                }
                slots={{
                    title: Title,
                    subtitle: Subtitle,
                    emailField: CustomEmailField,
                    passwordField: CustomPasswordField,
                    submitButton: CustomLoginButton,
                    signUpLink: SignUpLink,
                    forgotPasswordLink: ForgotPasswordLink,
                }}
                providers={providers}
            />
        </AppProvider>
    );
}
*/