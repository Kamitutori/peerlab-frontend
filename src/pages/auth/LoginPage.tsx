import { Alert, Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import { useTheme } from "@mui/material/styles";
import peerLabLogoLight from "../../assets/peerlab_logo_squared_transparent.svg";
import peerLabLogoDark from "../../assets/peerlab_logo_squared_transparent_white.svg";
import { useUpdateAuth } from "../../components/auth/AuthenticationContext.tsx";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useUpdateAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    function goToRegister() {
        navigate("/register");
    }

    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    useEffect(() => {
        if (localStorage.getItem("jwt") && localStorage.getItem("user")) {
            navigate("/dashboard");
        }
    }, [])

    const loginToApplication = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = input;
        if (email === "" || password === "") {
            setMessageProps("Please fill in all fields.", "warning");
            return;
        }
        if (!emailRegex.test(input.email)) {
            setMessageProps("Please enter a valid email address.", "warning");
            return;
        }
        const response = await login({ email, password });
        if (response.success) {
            navigate("/dashboard");
        } else {
            setMessageProps(response.message, "error");
        }
    };

    return (
        <Box>
            <Paper sx={{
                bgColor: "primary.main",
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
                        <img src={theme.palette.mode === 'dark' ? peerLabLogoDark : peerLabLogoLight}
                             alt="PeerLab logo"
                             style={{ height: 150, width: 150 }}
                        />
                        <h1>
                            Login
                        </h1>
                        {showMessage && (
                            <Alert
                                severity={messageType as 'error' | 'success'}
                                sx={{
                                    whiteSpace: 'pre-line',
                                    width: "100%",
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
                            style={{ color: "text.primary" }}
                            label="Show Password"
                            control={
                                <Checkbox
                                    style={{ color: "text.primary" }}
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