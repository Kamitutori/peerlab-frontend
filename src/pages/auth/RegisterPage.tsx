import {
    Alert,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import peerLabLogoTransparent from "../../assets/peerlabLogo_transparent.svg";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    const strongPasswordRegex: RegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    function backToLogin() {
        navigate("/login");
    }

    /** The registration input and it's handling function. */
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        rep_password: ""
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /** The props of a message the user receives as feedback on trying to register. */
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'warning' | ''>('');
    const [showMessage, setShowMessage] = useState(false);

    function setMessageProps(message: string, messageType: 'error' | 'success' | 'warning' | '') {
        setMessage(message);
        setMessageType(messageType);
        setShowMessage(true);
    }

    /** The register service routine. */
    const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.name === "" || input.email === "" || input.password === "" || input.rep_password === "") {
            setMessageProps("Please fill in all fields.", "warning");
            return;
        }
        if (input.password !== input.rep_password) {
            setMessageProps("Passwords do not match.", "warning");
            return;
        }
        if (!emailRegex.test(input.email)) {
            setMessageProps("Please enter a valid email address.", "warning");
            return;
        }
        if (!strongPasswordRegex.test(input.password)) {
            setMessageProps("Password unsafe.\n Requirements:\n Length between 8 and 32  as well as at least one uppercase and lowercase letter, number and special character.", "warning");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: input.name,
                    email: input.email,
                    password: input.password,
                })
            });

            if (response.ok) {
                setMessageProps(`Registration successful. Verify your email to authenticate and login afterward. Redirecting to login...`, "success");
                setTimeout(() => {
                    navigate("/login");
                }, 10000);
            } else {
                setMessageProps(`Registration failed: ${await response.text()}`, "error");
            }
        } catch (error) {
            setMessageProps(`There was an error during registration: ${error}`, "error");
        }
    }

    /** The register page components. */
    return (
        <Box>
            <Paper sx={{
                bgcolor: "#333",
                overflow: "hidden",
                wordWrap: "break-word",
                maxWidth: "400px",
                width: "400px"}}
                   elevation={4}
            >
                <form onSubmit={registerUser}>
                    <Stack rowGap={1}
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
                            Register
                        </h1>
                        {showMessage && (
                            <Alert severity={messageType as 'error' | 'success'} sx={{ whiteSpace: 'pre-line', width: "100%" , textAlign: "center", alignItems: "center"}}>
                                {message}
                            </Alert>
                        )}
                        <div></div>
                        <TextField
                            id="name-input"
                            name="name"
                            label="Name"
                            onChange={handleInput}
                        />
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
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleInput}
                        />
                        <TextField
                            id="confirm-password-input"
                            name="rep_password"
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleInput}
                        />
                        <FormControlLabel
                            style={{color: "#b5b5b5"}}
                            label="Show Password"
                            control={
                                <Checkbox style={{color: "#cdcdcd"}}
                                          onChange={() => setShowPassword(!showPassword)}
                                />
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
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
