import {Button, Checkbox, FormControlLabel, Paper, Stack, TextField} from "@mui/material";
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
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    if (localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/dashboard";
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const loginToApplication = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {email, password} = input;
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }
        await login({email, password});
        // TODO Statements here are not reached if successful. Remove alerts and insert error message here. Problem: how to transfer the response code?
    };

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
                        <Button id="login" type="submit" variant="contained" color="primary">
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
