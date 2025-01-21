/*
import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import {Button, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage'
*/

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
import { SignInPage } from '@toolpad/core/SignInPage';
import peerLabLogoTransparent from '../assets/peerlabLogo_transparent.svg';
import {AuthProvider} from "./SignUpPage.tsx";
import {useQuery} from "@tanstack/react-query";
import {redirect} from "react-router-dom";

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

/*
function AgreeWithTerms() {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    name="tandc"
                    value="true"
                    color="primary"
                    sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                />
            }
            slotProps={{
                typography: {
                    fontSize: 14,
                },
            }}
            color="textSecondary"
            label="I agree with the T&C"
        />
    );
}
*/

function handleSignIn(_provider: AuthProvider, formData: FormData) {
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

export default function SlotsSignIn() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: { default: '#333' },
            primary: { main: '#5567d6' },
        },
    });
    return (
        <AppProvider branding={BRANDING} theme={darkTheme}>
            <SignInPage
                signIn={(provider, formData) =>
                    handleSignIn(provider, formData)
                /*
                    alert(
                        `Logging in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}, and checkbox value: ${formData.get('tandc')}.`,
                    )
                */
                }
                slots={{
                    title: Title,
                    subtitle: Subtitle,
                    emailField: CustomEmailField,
                    passwordField: CustomPasswordField,
                    submitButton: CustomLoginButton,
                    signUpLink: SignUpLink,
                    //rememberMe: AgreeWithTerms,
                    forgotPasswordLink: ForgotPasswordLink,
                }}
                providers={providers}
            />
        </AppProvider>
    );
}
