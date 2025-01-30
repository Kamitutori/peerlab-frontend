// TODO proper response messages (not the alert bs from authcontext)
// TODO maybe better redirection implementation necessary. but if you fiddle with jwts, f. you

import {Button, Checkbox, FormControlLabel, Paper, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import peerLabLogoTransparent from "../../assets/peerlabLogo_transparent.svg";
import {useUpdateAuth} from "../../components/auth/AuthenticationContext.tsx";

function goToRegister() {
    window.location.href = "http://localhost:5173/register";
}

export default function LoginPage() {
    const emailRegex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/;
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

    /**
     * Redirection in case of present jwt (assuming, the user is logged in).
     */
    if (localStorage.getItem("jwt") && localStorage.getItem("user")) {
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
         /* if (emailRegex.test(email)) {
            alert("Your email has no valid format.")
             return;
        } */
        await login({email, password});
        // TODO Statements here are not reached if successful. Remove alerts and insert error message here. Problem: how to transfer the response code?
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
