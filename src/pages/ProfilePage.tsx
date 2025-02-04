// TODO proper implementation of lists

import React, {useState} from "react";
import {
    Alert, Avatar,
    Box,
    Button, Card,
    Checkbox,
    FormControlLabel,
    Grid2,
    TextField,
    Typography,
} from "@mui/material";
import PaperList from "../components/PaperList.tsx";
import {useUpdateAuth} from "../components/auth/AuthenticationContext.tsx";
import {useAlertDialog} from "../components/AlertDialogProvider.tsx";

/** The ProfilePage component is a page that displays the user's account and provides functionality to manage it. */
function ProfilePage() {
    const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    const LOCAL_STORAGE_UPDATE_EVENT = "localStorageUpdate";

    /** This effect updates the account information on the page if the user changed it. */
    const [userName, setUserName] = useState<string>(" ");
    const [userEmail, setUserEmail] = useState<string>(" ");

    const {showAlert} = useAlertDialog();
    const {logout} = useUpdateAuth();

    React.useEffect(() => {
        const updateProfile = () => {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                try {
                    if (JSON.parse(userJson).name === undefined || JSON.parse(userJson).email === undefined) {
                        showAlert("User Object Error", "Unexpected behavior: User object in local storage is undefined. You will be logged out as a result.", "", "OK")
                            .then(() => {
                                logout();
                            });
                    }
                    setUserName(JSON.parse(userJson).name);
                    setUserEmail(JSON.parse(userJson).email)
                } catch (error) {
                    showAlert("User Object Error", "Unexpected behavior: User object in local storage is not a valid JSON object. You are logged out as a result.", "", "OK")
                        .then(() => {
                            logout();
                        });
                }
            } else {
                showAlert("Invalid Storage State", "There is no user object in your local storage. You will be logged out.", "", "OK")
                    .then(() => {
                        logout();
                    });
            }
        }
        updateProfile();
        const handleStorageChange = () => {
            updateProfile();
        }
        window.addEventListener(LOCAL_STORAGE_UPDATE_EVENT, handleStorageChange);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener(LOCAL_STORAGE_UPDATE_EVENT, handleStorageChange);
        };
    }, []);

    /** The props of a message the user receives as feedback on changing his account. */
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'warning' | ''>('');
    const [showMessage, setShowMessage] = useState(false);

    function setMessageProps(message: string, messageType: 'error' | 'success' | 'warning' | '') {
        setMessage(message);
        setMessageType(messageType);
        setShowMessage(true);
    }

    /** These functions manage the interactions with the account menu. */
    const handleReset = () => {
        setInputToDefault();
        setShowMessage(false);
    }

    /** These functions handle the input of account changes. */
    const [input, setInput] = useState({
        name: "",
        password: "",
        confirmPassword: ""
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setInputToDefault = () => {
        setInput({
            name: "",
            password: "",
            confirmPassword: ""
        });
        passwordToSubmit = null;
    };

    const [showPassword, setShowPassword] = useState(false);
    let passwordToSubmit: string | null = null;

    /** These functions implement the account settings functionality. */
    const submit = async () => {
        if (input.password !== input.confirmPassword) {
            setMessageProps("Passwords do not match.", "warning");
            return;
        }
        if (input.password !== "") {
            if (!strongPasswordRegex.test(input.password)) {
                setMessageProps("Password unsafe.\n Requirements:\n Length between 8 and 32  as well as at least one uppercase and lowercase letter, number and special character.", "warning");
                return;
            } else {
                passwordToSubmit = input.password;
            }
        }

        try {
            const res = await fetch("http://localhost:8080/api/users", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    name: input.name,
                    password: passwordToSubmit
                })
            });
            if (res.status == 200) {
                const responseData = await res.json();
                setMessageProps("Successfully edited profile.", "success");
                localStorage.setItem("user", JSON.stringify(responseData));
                window.dispatchEvent(new Event(LOCAL_STORAGE_UPDATE_EVENT));
                setTimeout(() => {
                    handleReset();
                }, 3000);
            } else if (res.status == 401) {
                await showAlert("Forced Logout", "You will be logged out shortly as your token is invalid.", "", "OK");
                logout();
            } else {
                setMessageProps(`An error has occurred: ${res.status}: ${res.statusText}`, "error");
            }
        } catch (error) {
            await showAlert("Error", `There was an error during the process: ${error}.`, "", "OK");
        }
    }

    const handleAccountDeletion = async () => {
        const result = await showAlert("Account Deletion", "Are you sure you want to delete your account? All data will be lost.", "Delete", "Cancel");
        if (!result) return;
        try {
            const res = await fetch("http://localhost:8080/api/users", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            if (res.status == 200) {
                await showAlert("Account Deletion", "Your account was successfully deleted.", "", "Acknowledge");
                logout();
            } else if (res.status == 401) {
                await showAlert("Forced Logout", "You will be logged out shortly as your token is invalid.", "", "OK");
                logout();
            } else {
                setMessageProps(`An error has occurred: ${res.status}: ${res.statusText}`, "error");
            }
        } catch (error) {
            await showAlert("Error", `An error has occurred. ${error}.`, "", "OK");
        }
    }

    function stringAvatar(name: string) {
        // Handle empty or invalid name
        if (!name || typeof name !== "string") {
            return {
                sx: { bgcolor: "theme.palette.secondary.main" },
                children: "",
            };
        }

        // Split the name by spaces
        const nameParts = name.trim().split(/\s+/);

        // Extract the first and last initials
        const firstInitial = nameParts[0]?.[0] || ""; // First part's first letter
        const lastInitial = nameParts[nameParts.length - 1]?.[0] || ""; // Last part's first letter
        return {
            sx: { bgcolor: "theme.palette.secondary.main" },
            children: `${firstInitial}${lastInitial}`.toUpperCase(),
        };
    }

    /** The profile page components. */
    return (
        <Grid2
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch', // Ensures both cards are the same height
                marginLeft: 10,
                marginTop: 10,
                width: '100%',
                paddingLeft: '10px', // Add space to prevent overlap by the drawer
                paddingTop: '10px',
                gap: 4, // Add gap between the cards
            }}
        >
            {/* User Profile Card */}
            <Card
                variant="outlined"
                sx={{
                    flex: 1, // Ensure both cards take equal space
                    padding: 3,
                    minWidth: '320px', // Wider card
                    maxWidth: '380px',
                    minHeight: '540px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // Spread content vertically
                    alignItems: 'center',
                }}
            >
                <Grid2
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    {/* Profile Section */}
                    <Grid2
                        sx={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {/* Centered Avatar */}
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                mb: 2,
                                fontSize: 36, // Scaled text size
                                display: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {stringAvatar(userName).children}
                        </Avatar>

                        {/* User Info */}
                        <Typography variant="h6">{userName}</Typography>
                        <Typography color="text.secondary">{userEmail}</Typography>
                    </Grid2>

                    {/* Response Message */}
                    {showMessage && (
                        <Box
                            sx={{
                                my: 2,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Alert
                                severity={messageType as 'error' | 'success'}
                                sx={{
                                    whiteSpace: 'pre-line',
                                    width: 'fit-content',
                                    textAlign: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {message}
                            </Alert>
                        </Box>
                    )}

                    {/* Edit Account Input */}
                    <Grid2
                        container
                        spacing={2}
                        direction="column"
                        sx={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}
                    >
                        <Grid2>
                            <TextField
                                type="text"
                                name="name"
                                label="New Name"
                                variant="outlined"
                                fullWidth
                                value={input.name}
                                onChange={handleInput}
                            />
                        </Grid2>
                        <Grid2>
                            <TextField
                                type={!showPassword ? 'password' : 'text'}
                                name="password"
                                label="New Password"
                                variant="outlined"
                                fullWidth
                                value={input.password}
                                onChange={handleInput}
                            />
                        </Grid2>
                        <Grid2>
                            <TextField
                                type={!showPassword ? 'password' : 'text'}
                                name="confirmPassword"
                                label="Confirm Password"
                                variant="outlined"
                                fullWidth
                                value={input.confirmPassword}
                                onChange={handleInput}
                            />
                        </Grid2>
                        <Grid2>
                            <FormControlLabel
                                style={{color: '#b5b5b5'}}
                                label="Show Password"
                                control={
                                    <Checkbox
                                        style={{color: '#cdcdcd'}}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                }
                            />
                        </Grid2>
                        <Grid2 container spacing={2} justifyContent="space-between">
                            <Grid2>
                                <Button
                                    variant="contained"
                                    onClick={submit}
                                >
                                    Confirm
                                </Button>
                            </Grid2>
                            <Grid2>
                                <Button
                                    variant="outlined"
                                    onClick={handleReset}
                                >
                                    Clear
                                </Button>
                            </Grid2>
                        </Grid2>
                        <Grid2>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleAccountDeletion}
                                fullWidth
                            >
                                Delete Account
                            </Button>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Card>

            {/* Card with Tables */}
            <Card
                variant="outlined"
                sx={{
                    flex: 1, // Same width as the profile card
                    marginX: 2,
                    padding: 3,
                    minWidth: '320px',
                    minHeight: '540px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Grid2
                    container
                    spacing={4}
                    justifyContent="center"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <PaperList endpoint={`http://localhost:8080/api/papers`} title="My Papers"/>
                    <PaperList endpoint={`http://localhost:8080/api/papers`} title="My Reviews"/>
                </Grid2>
            </Card>
        </Grid2>
    );
}

export default ProfilePage;
