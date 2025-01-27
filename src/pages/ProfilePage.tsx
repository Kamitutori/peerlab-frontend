// TODO: change password (functionality, styling, input fields)
// TODO: change user data
// TODO: user deletion
// TODO: styling
// TODO: implement the actual paper and review tables
// TODO: orientation and design of Options button

import React, {useState} from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem, Alert,
} from "@mui/material";

function ProfilePage() {
    let strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'warning' | ''>('');
    const [showMessage, setShowMessage] = useState(false);

    function setMessageProps(message: string, messageType: 'error' | 'success' | 'warning' | '') {
        setMessage(message);
        setMessageType(messageType);
        setShowMessage(true);
    }

    const papers = ["paper_1", "paper_2", "paper_3", "paper_4"];
    const reviews = ["reviewed_paper_1", "reviewed_paper_2", "reviewed_paper_3", "reviewed_paper_4"];

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    };

    const submitChangePassword = async () => {
        if (input.password !== input.confirmPassword) {
            setMessageProps("Passwords do not match.", "warning");
            return;
        } else if (!strongPasswordRegex.test(input.password)) {
            setMessageProps("Password unsafe.\n Requirements:\n Length between 8 and 32  as well as at least one uppercase and lowercase letter, number and special character.", "warning");
            return;
        }
    };

    return (
        <Box sx={{width: "800px", display: "flex", height: "flex", backgroundColor: "#777"}}>
            {/* Content */}
            <Box sx={{flexGrow: 1, padding: 4}}>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2}}>

                    <Box>
                        {/* Header */}
                        <Typography variant="subtitle1" sx={{mb: 2}}>
                            {/*<Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}> */}
                                <Typography variant="h4">
                                    Name Surname
                                    {/* localStorage.get("user").name */}
                                </Typography>
                                {/*</Box> */}

                            <Typography variant="subtitle1" sx={{mb: 2}}>
                                email@email.kit.edu
                                {/* localStorage.get("user").email */}
                            </Typography>
                        </Typography>
                    </Box>

                    {/* Options Menu */}
                    <Box sx={{mt: 1}}>
                        <Button
                            variant="outlined"
                            aria-controls="options-menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
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
                                    // Logic for Delete Profile can go here
                                    console.log("Delete Profile Clicked");
                                }}
                            >
                                Delete Profile
                            </MenuItem>
                        </Menu>
                    </Box>

                </Box>

                <Divider sx={{my: 2}}/>

                {/* Optional Change Menus */}
                {isEditProfile && (
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}>
                        <Typography variant="h4">
                            Edit Profile
                        </Typography>
                    </Box>
                )}

                {isChangePassword && (
                    <Box sx={{display: "grid", justifyContent: "center", mb: 4}}>
                        <Typography variant="h6" sx={{mb: 2}}>
                            Change Password
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                <TextField
                                    type="password"
                                    name="password"
                                    label="New Password"
                                    variant="outlined"
                                    value={input.password}
                                    onChange={handleInput}
                                />
                            </Box>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                <TextField
                                    type="password"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    variant="outlined"
                                    value={input.confirmPassword}
                                    onChange={handleInput}
                                />
                            </Box>
                        </Stack>
                        <Box sx={{ sidplay: "flex", gap: 2, mx: 2}}>
                            <Button
                                variant="contained"
                                sx={{mt: 2}}
                                onClick={submitChangePassword}
                            >
                                Confirm
                            </Button>
                            <Button
                            variant="outlined"
                            sx={{mt: 2}}
                            onClick={() => {
                                setIsChangePassword(false);
                                setInputToDefault();
                            }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}

                {(isChangePassword || isEditProfile) && showMessage && (
                    <Alert severity={messageType as 'error' | 'success'}
                           sx={{
                               whiteSpace: 'pre-line',
                               width: "fit-content",
                               textAlign: "center",
                               alignItems: "center",
                               justifyContent: "center",
                               }}
                    >
                        {message}
                    </Alert>
                )}

                {(isChangePassword || isEditProfile) && (
                    <Divider sx={{my: 2}}/>

                )}

                {/* Papers and Reviews */}
                <Box sx={{display: "flex", gap: 4}}>
                    {/* Papers */}
                    <Box sx={{flex: 1}}>
                        <Typography variant="h6">Papers:</Typography>
                        <Paper variant="outlined" sx={{maxHeight: "200px", overflowY: "auto", mt: 1}}>
                            <List>
                                {papers.map((paper, index) => (
                                    <ListItem key={index} divider>
                                        <ListItemText primary={paper}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>

                    {/* Reviews */}
                    <Box sx={{flex: 1}}>
                        <Typography variant="h6">Reviews:</Typography>
                        <Paper variant="outlined" sx={{maxHeight: "200px", overflowY: "auto", mt: 1}}>
                            <List>
                                {reviews.map((review, index) => (
                                    <ListItem key={index} divider>
                                        <ListItemText primary={review}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ProfilePage;
