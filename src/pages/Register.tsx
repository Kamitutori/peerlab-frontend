import {
    Button,
    Checkbox,
    createTheme,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
    ThemeProvider
} from "@mui/material";
import Box from "@mui/material/Box";
import {redirect} from "react-router-dom";
import React, {useState} from "react";
import peerLabLogoTransparent from "../assets/peerlabLogo_transparent.svg";
import {useQuery} from "@tanstack/react-query";

const theme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                size:"small",
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
                }}}}
});

function backToLogin() {
    window.location.href = "http://localhost:5173/login";
    redirect("/login");
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        rep_password:""
    });

    const { data: responseData } =
        useQuery({
        queryKey: ['register'],
        queryFn: async () => {
        /*
            if (!fetching) {
                return HTML
            }
        */
            console.log("Submitting...");
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': '*/*',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    name: input.name,
                    email: input.email,
                    password: input.password,
                })
            })
            return (await res.json());
        },
        enabled: fetching,
        refetchOnReconnect: false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        retryOnMount: false,
        retry: 0
    })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(input);
    };

    const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, password, rep_password } = {
            name: input.name,
            email: input.email,
            password: input.password,
            rep_password: input.rep_password};
        if (password !== rep_password) {
            alert("Passwords do not match");
            return;
        }
        if (name === "" || email === "" || password === "" || rep_password === "") {
            alert("Please fill in all fields.");
            return;
        }

        /*
        const response = registerQuery();
        if (response === null) {
            console.log("Houston, we have a problem.");
            return;
        } else {
            console.log(JSON.stringify(response))
        }
        */

        if (responseData === undefined) {
            console.log("Houston, we have a problem.");
            return;

        }

        setFetching(true);
        responseData.refetch();
        setFetching(false);

    if (responseData.data !== undefined) {
        if (responseData.get('status') === 200) {
            console.log('Success!');
            redirect('/login');
        }  else {
                //console.log(responseData.data);
            }
            alert(`Failed to register: ${responseData.get('message')}`);
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
                               alignItems: "center",}}
                    >
                        <img src={peerLabLogoTransparent}
                             alt="PeerLab logo"
                             style={{height: 100, width: 100}}
                        />
                        <h1 style={{ color:"#fff" }}>Register</h1>
                        <div></div>
                        <ThemeProvider theme={theme}>
                            <TextField id="name-input" name="name" label="Name" onChange={handleInput}></TextField>
                            <TextField id="email-input" name="email" label="Email" onChange={handleInput}></TextField>
                            <TextField id="password-input" name="password" label="Password"
                                       type={showPassword ? 'text' : 'password'} onChange={handleInput}></TextField>
                            <TextField id="repeat-password-input" name="rep_password" label="Repeat Password"
                                       type={showPassword ? 'text' : 'password'} onChange={handleInput}>
                            </TextField>
                                <FormControlLabel style={{ color:"#b5b5b5" }} label="Show Password" control={
                                    <Checkbox style={{ color:"#cdcdcd" }} onChange={() => setShowPassword(!showPassword)} />}
                                />
                            <Button id="register" type="submit" variant="contained" color="primary">Register</Button>
                            <Button variant="outlined" color="primary" onClick={backToLogin}>Back To Login</Button>
                        </ThemeProvider>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
