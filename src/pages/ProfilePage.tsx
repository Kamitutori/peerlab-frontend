// TODO proper implementation of lists
// TODO styling of page

import React, {useState} from "react";
import {Alert, Box, Button, Divider, Grid2, Menu, MenuItem, Stack, TextField, Typography,} from "@mui/material";
import PaperList from "../components/PaperList.tsx";
import {useUpdateAuth} from "../components/auth/AuthenticationContext.tsx";
import {useAlertDialog} from "../components/AlertDialogProvider.tsx";

/** The ProfilePage component is a page that displays the user's account and provides functionality to manage it. */
function ProfilePage() {
    const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const INVALID_TOKEN_MSG = "Your token is invalid. You will be logged out soon.";
    const ACCOUNT_DELETION_ALERT_TITLE = "Account Deletion";
    const ACCOUNT_DELETION_ALERT_MESSAGE = "Are you sure you want to delete your account? All data will be deleted.";
    const ACCOUNT_DELETION_CONFIRM_TEXT = "Delete";
    const ACCOUNT_DELETION_CANCEL_TEXT = "Cancel";
    const LOCAL_STORAGE_UPDATE_EVENT = "localStorageUpdate";

    /** This effect updates the account information on the page if the user changed it. */
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const { showAlert } = useAlertDialog();
    const {logout} = useUpdateAuth();

    React.useEffect(() => {
        const updateProfile = () => {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                try {
                    if (JSON.parse(userJson).name === undefined || JSON.parse(userJson).email === undefined) {
                        alert("Unexpected behavior: User object in localStorage is missing name or email. You will be logged out.");
                        setTimeout(() => {
                                logout()
                            },
                            3000)
                    }
                    setUserName(JSON.parse(userJson).name);
                    setUserEmail(JSON.parse(userJson).email)
                } catch (error) {
                    alert("Unexpected behavior: User object in localStorage is not a valid JSON object. You will be logged out.");
                    logout();
                }
            } else {
                alert("Unexpected behavior: User is on profile page with no user object in localStorage. You will be logged out.");
                logout();
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

    /** These attributes indicate which part of his account the user currently edits. */
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isAccountDeletion, setIsAccountDeletion] = useState(false);

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setInputToDefault()
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setShowMessage(false);
    };

    const handleCancellation = () => {
        setIsEditProfile(false);
        setIsChangePassword(false);
        setIsAccountDeletion(false);
        setShowMessage(false);
    }

    /** These functions handle the input of account changes. */
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(input);
    };

    const setInputToDefault = () => {
        setInput({
            name: "", //localStorage.getItem("user").name,
            email: "", //localStorage.getItem("user").email,
            password: "",
            confirmPassword: ""
        });
    };

    /** These functions implement the account settings functionality. */
    const handleSubmit = () => {
        if (isEditProfile) {
            submitEditProfile();
        } else if (isChangePassword) {
            submitChangePassword();
        }
    }

    const submitEditProfile = async () => {
        if (emailRegex.test(input.email)) {
            try {
                const res = await fetch("http://localhost:8080/api/users", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({
                        // TODO how to handle empty fields? just fill them up? or fill fields by default?
                        name: input.name,
                        email: input.email
                    })
                });
                if (res.status == 200) {
                    setMessageProps("Successfully edited profile.", "success");
                    const responseData = await res.json();
                    localStorage.setItem("user", JSON.stringify(responseData));
                    window.dispatchEvent(new Event(LOCAL_STORAGE_UPDATE_EVENT));
                    setTimeout(() => {
                        handleMenuClose();
                        setIsEditProfile(false);
                    }, 3000);
                } else if (res.status == 400) {
                    setMessageProps("Your inputs are invalid.", "error");
                } else if (res.status == 401) {
                    handleUnauthenticatedLogout()
                } else {
                    setMessageProps(`An error has occurred: ${res.status}: ${res.statusText}`, "error");
                }
            } catch (error) {
                alert(`An error has occurred: ${error}.`)
            }
        } else {
            setMessageProps("Invalid email address.", "warning");
        }
    }

    const submitChangePassword = async () => {
        if (input.password !== input.confirmPassword) {
            setMessageProps("Passwords do not match.", "warning");
            return;
        } else if (!strongPasswordRegex.test(input.password)) {
            setMessageProps("Password unsafe.\n Requirements:\n Length between 8 and 32  as well as at least one uppercase and lowercase letter, number and special character.", "warning");
            return;
        } else {
            try {
                const res = await fetch("http://localhost:8080/api/users", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({
                        password: input.password
                    })
                });
                if (res.status == 200) {
                    const responseData = await res.json();
                    setMessageProps("Successfully changed password.", "success");
                    localStorage.setItem("user", JSON.stringify(responseData));
                    setTimeout(() => {
                        handleMenuClose();
                        setIsChangePassword(false);
                    }, 3000);
                } else if (res.status == 400) {
                    setMessageProps("The password was invalid.", "error");
                } else if (res.status == 401) {
                    handleUnauthenticatedLogout()
                } else {
                    setMessageProps(`An error has occurred: ${res.status}: ${res.statusText}`, "error");
                }
            } catch (error) {
                alert(`An error has occurred: ${error}.`)
            }
        }
    };

    const handleAccountDeletion = async () => {
        const result = await showAlert(ACCOUNT_DELETION_ALERT_TITLE, ACCOUNT_DELETION_ALERT_MESSAGE, ACCOUNT_DELETION_CONFIRM_TEXT, ACCOUNT_DELETION_CANCEL_TEXT);
        result ? submitAccountDeletion() : setIsAccountDeletion(false);
    }

    const submitAccountDeletion = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/users", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                }
            })
            if (res.status == 200) {
                setMessageProps("Successfully deleted account. You will be logged out.", "success");
                setTimeout(() => {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("user");
                    window.location.href = "http://localhost:5173/login";
                }, 3000);
            } else if (res.status == 401) {
                handleUnauthenticatedLogout();
            } else {
                setMessageProps(`An error has occurred: ${res.status}: ${res.statusText}`, "error");
            }
        } catch (error) {
            alert(`An error has occurred. ${error}.`)
        }
    }

    /* This function is called to log out users that sent requests with invalid tokens. */
    const handleUnauthenticatedLogout = () => {
        setMessageProps(INVALID_TOKEN_MSG, "error");
        setTimeout(() => {
            logout();
        }, 3000)
    }

    /** The profile page components. */
    return (
        <Box sx={{
            width: "flex",
            minWidth: "1215px",
            display: "flex",
            height: "flex",
            backgroundColor: "#777",
            marginTop: 10,
        }}
        >
            {/** Content */}
            <Box sx={{flexGrow: 1, padding: 4}}>

                {/** Wraps header and options */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2
                }}
                >
                    <Box>
                        {/** Header */}
                        <Typography variant="subtitle1" sx={{mb: 2, maxWidth: "100%"}}>
                            <Typography variant="h4" sx={{mb: 2}}>
                                {userName}
                            </Typography>
                            <Typography variant="subtitle1" sx={{mb: 2}}>
                                {userEmail}
                            </Typography>
                        </Typography>
                    </Box>

                    {/** Options Menu */}

                    <Button
                        variant="outlined"
                        aria-controls="options-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        sx={{justifySelf: "end", height: "fit-content"}}
                    >
                        Options
                    </Button>
                    <Menu
                        id="options-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setIsEditProfile(!isEditProfile);
                                setIsChangePassword(false);
                            }}
                        >
                            Edit Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setIsChangePassword(!isChangePassword);
                                setIsEditProfile(false);
                            }}
                        >
                            Change Password
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setIsAccountDeletion(!isAccountDeletion);
                                setIsChangePassword(false);
                                setIsEditProfile(false);
                                handleAccountDeletion();
                            }}
                        >
                            Delete Profile
                        </MenuItem>
                    </Menu>

                </Box>
                <Divider sx={{my: 2}}/>

                {/** Optional Account Setting Menus */}
                {(isEditProfile || isChangePassword) && (
                    <Box sx={{
                        display: "grid",
                        justifyContent: "center",
                    }}
                    >
                        <Typography variant="h6" sx={{mb: 2, justifySelf: "center"}}>
                            {isEditProfile ? "Edit Profile" : "Change Password"}
                        </Typography>

                        <Stack spacing={2}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                <TextField
                                    type={isEditProfile ? "text" : "password"}
                                    name={isEditProfile ? "name" : "password"}
                                    label={isEditProfile ? "New Name" : "New Password"}
                                    variant="outlined"
                                    value={isEditProfile ? input.name : input.password}
                                    onChange={handleInput}
                                />
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                <TextField
                                    type={isEditProfile ? "text" : "password"}
                                    name={isEditProfile ? "email" : "confirmPassword"}
                                    label={isEditProfile ? "New Email" : "Confirm Password"}
                                    variant="outlined"

                                    value={isEditProfile ? input.email : input.confirmPassword}
                                    onChange={handleInput}
                                />
                            </Box>
                        </Stack>
                    </Box>
                )}

                {/** Confirmation and Cancellation Buttons */}
                {(isEditProfile || isChangePassword) && (
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        justifyContent: "center", // Centers grid items horizontally
                        alignItems: "center",     // Centers grid items vertically
                        paddingX: 1,
                        gap: 2,
                    }}>
                        <Button
                            variant="contained"
                            sx={{mt: 2, width: "fit-content", justifySelf: "end"}}
                            onClick={handleSubmit}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{mt: 2, width: "fit-content", justifySelf: "start"}}
                            onClick={() => {
                                handleCancellation();
                                setInputToDefault();
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
                {/** Feedback Message */}
                {showMessage && (
                    <Box
                        sx={{
                            my: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Alert
                            severity={messageType as 'error' | 'success'}
                            sx={{
                                whiteSpace: 'pre-line',
                                width: "fit-content",
                                textAlign: "center",
                                alignItems: "center"
                            }}
                        >
                            {message}
                        </Alert>
                    </Box>
                )}
                {(isEditProfile || isChangePassword) && (
                    <Divider sx={{my: 2}}/>
                )}

                {/** Papers and Reviews */}
                <Grid2 container spacing={4} justifyContent="center"
                       sx={{display: 'flex', flexDirection: 'row', width: "100%"}}>
                    <PaperList
                        endpoint={`http://localhost:8080/api/papers`}
                        title="My Papers"
                    />
                    <PaperList
                        endpoint={`http://localhost:8080/api/papers`}
                        title="My Reviews"
                    >
                    </PaperList>
                </Grid2>
            </Box>
        </Box>
    );
}

export default ProfilePage;
