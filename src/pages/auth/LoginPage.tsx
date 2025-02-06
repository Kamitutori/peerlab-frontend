import {Alert, Button, Checkbox, FormControlLabel, Paper, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import peerLabLogoTransparent from "../../assets/peerlab_logo_squared_transparent.svg";
import {useUpdateAuth} from "../../components/auth/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //const strongPasswordRegex: RegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    const [showPassword, setShowPassword] = useState(false);
    const {login} = useUpdateAuth();
    const navigate = useNavigate();

    function goToRegister() {
        navigate("/register");
    }

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
    if (localStorage.getItem("jwt") && localStorage.getItem("user")) {
        navigate("/dashboard");
    }

    /** This function performs basic checks before calling the login routine. */
    const loginToApplication = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {email, password} = input;
        if (email === "" || password === "") {
            setMessageProps("Please fill in all fields.", "warning");
            return;
        }
        if (!emailRegex.test(input.email)) {
            setMessageProps("Please enter a valid email address.", "warning");
            return;
        }
        /*if (!strongPasswordRegex.test(input.password)) {
            setMessageProps("Password unsafe.\n Requirements:\n Length between 8 and 32  as well as at least one uppercase and lowercase letter, number and special character.", "warning");
            return;
        }*/
        const response = await login({email, password});
        if (response.success) {
            navigate("/dashboard");
        } else {
            setMessageProps(response.message, "error");
        }
    };

    /** The login page components. */
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
                        <img src={peerLabLogoTransparent}
                             alt="PeerLab logo"
                             style={{height: 150, width: 150}}
                        />
                        <h1>
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
                            style={{color: "text.primary"}}
                            label="Show Password"
                            control={
                                <Checkbox
                                    style={{color: "text.primary"}}
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
