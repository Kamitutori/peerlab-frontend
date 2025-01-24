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

function backToLogin() {
    window.location.href = "http://localhost:5173/login";
    redirect("/login");
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        rep_password: ""
    });

    const {data, refetch} =
        useQuery({
            queryKey: ['register'],
            queryFn: async () => {
                console.log("Submitting...");
                const res = await fetch("http://localhost:8080/api/auth/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: input.name,
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

    const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {name, email, password, rep_password} = {
            name: input.name,
            email: input.email,
            password: input.password,
            rep_password: input.rep_password
        };
        if (password !== rep_password) {
            alert("Passwords do not match");
            return;
        }
        if (name === "" || email === "" || password === "" || rep_password === "") {
            alert("Please fill in all fields.");
            return;
        }

        refetch();


        // This bs does not work. Need to work with .then(...)
        if (data !== undefined) {
            console.log("entered");
            if (data.get('status') === 200) {
                console.log('Successfully registered. Please look into your emails to authenticate. Afterwards, you can login.');
                redirect('/login');
            } else {
                alert(`Failed to register: ${data.get('message')}`);
                console.log(data.get('status'), JSON.stringify(data.error));
            }
        }

    }

    return (
        <Box>
            <Paper sx={{bgcolor: "#333"}} elevation={4} square={false}>
                <form onSubmit={registerUser}>
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
                        <h1 style={{color: "#fff"}}>Register</h1>
                        <div></div>
                        {/* <ThemeProvider theme={theme}> */}
                            <TextField
                                id="name-input"
                                name="name"
                                label="Name"
                                onChange={handleInput}
                            >
                            </TextField>
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
                            <TextField
                                id="repeat-password-input"
                                name="rep_password"
                                label="Repeat Password"
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
                                id="register"
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Register
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={backToLogin}
                            >
                                Back To Login
                            </Button>
                        {/* </ThemeProvider> */}
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
