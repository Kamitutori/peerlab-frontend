// TODO proper response messages (not the alert bs from authcontext)
// TODO maybe better redirection implementation necessary. but if you fiddle with jwts, f. you

import {Alert, Button, Checkbox, FormControlLabel, Paper, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import peerLabLogoTransparent from "../../assets/peerlabLogo_transparent.svg";
import {useUpdateAuth} from "../../components/auth/AuthenticationContext.tsx";

function goToRegister() {
    window.location.href = "http://localhost:5173/register";
}

export default function LoginPage() {
    const {login} = useUpdateAuth();
    const [showPassword, setShowPassword] = useState(false);

    /** The login input and it's handling function. */
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /** The props of a message the user receives as feedback on trying to login. */
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'warning' | ''>('');
    const [showMessage, setShowMessage] = useState(false);

    function setMessageProps(message: string | undefined, messageType: 'error' | 'success' | 'warning' | '') {
        if (message === undefined) {
            setMessage("Unexpected Behavior: Message is null.");
        } else {
            setMessage(message);
        }
        setMessageType(messageType);
        setShowMessage(true);
    }

    /**
     * Redirection in case of present jwt (assuming, the user is logged in).
     */
    if (localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/dashboard";
    }

    /** This function performs basic checks before calling the login routine. */
    const loginToApplication = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {email, password} = input;
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }
        const response = await login({email, password});
        console.log(response);
        if (response.success) {
            window.location.href = "http://localhost:5173/dashboard";
        } else {
            setMessageProps(response.message, "error");
        }
    };

    /** The login page components. */
    return (
        <Box>
            <Paper sx={{
                bgcolor: "#333",
                width: "350px",
                maxWidth: "350px"
            }}
                   elevation={4}
            >
                <form onSubmit={loginToApplication}>
                    <Stack
                        rowGap={1}
                        paddingX={6}
                        paddingY={2}
                        spacing={0.5}
                        direction="column"
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img src={peerLabLogoTransparent}
                             alt="PeerLab logo"
                             style={{height: 100, width: 100}}
                        />
                        <h1 style={{color: "#fff"}}>
                            Login
                        </h1>
                        {showMessage && (
                            <Alert
                                severity={messageType as 'error' | 'success'}
                                sx={{
                                    whiteSpace: 'pre-line',
                                    width: "100%" ,
                                    textAlign: "center",
                                    alignItems: "center"
                            }}
                            >
                                {message}
                            </Alert>
                        )}
                        <div></div>
                        <TextField
                            id="email-input"
                            name="email"
                            label="Email"
                            onChange={handleInput}
                        />
                        <TextField
                            id="password-input"
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            onChange={handleInput}
                        />
                        <FormControlLabel
                            style={{color: "#b5b5b5"}}
                            label="Show Password"
                            control={
                                <Checkbox
                                    style={{color: "#cdcdcd"}}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                        <Button id="login"
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
