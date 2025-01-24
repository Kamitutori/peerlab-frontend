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
