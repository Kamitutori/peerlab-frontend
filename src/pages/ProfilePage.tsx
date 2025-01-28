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
    MenuItem, Alert, Grid,
} from "@mui/material";
import PaperList from "../components/PaperList.tsx";
import ReviewList from "../components/ReviewList.tsx";

function ProfilePage() {
    let strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    React.useEffect(() => {
        // Retrieve and parse user object from localStorage
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                setUserName(JSON.parse(userJson).email);
                setUserEmail(JSON.parse(userJson).email)
            } catch (error) {
                setUserName(null);
                setUserEmail(null)
                alert("Unexpected behavior: User object in localStorage is not a valid JSON object.");
            }
        } else {
            alert("Unexpected behavior: User is on profile page with no user object in localStorage.");
        }
    }, []);

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
        setInputToDefault()
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setShowMessage(false);
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
            name: "", //localStorage.getItem("user").name,
            email: "", //localStorage.getItem("user").email,
            password: "",
            confirmPassword: ""
        });
    };

    const submitEditProfile = async () => {
        if (emailRegex.test(input.email)) {
            console.log(`Authorization: Bearer ${localStorage.getItem("jwt")}`);
            try {
                const res = await fetch("http://localhost:8080/api/user/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({
                        // TODO this implementation assumes that the current values are inserted. Decide, whether empty fields will be ignored.
                        name: input.name,
                        email: input.email
                    })
                });
                if (res.status == 200) {
                    setMessageProps("Successfully edited profile.", "success");
                    localStorage.setItem("user", JSON.stringify({
                        // id: localStorage.getItem("user").id,
                        name: input.name,
                        email: input.email,
                    }));
                } else if (res.status == 400) {
                    // TODO implement good failure handling
                    setMessageProps("Failure: 400", "error");
                } else if (res.status == 403) {
                    setMessageProps("Your token is invalid.", "error")
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
        } /* else if (!strongPasswordRegex.test(input.password)) {
            setMessageProps("Password unsafe.\n Requirements:\n Length between 8 and 32  as well as at least one uppercase and lowercase letter, number and special character.", "warning");
            return;
        } */ else {
            try {
                console.log(`Authorization Bearer ${localStorage.getItem("jwt")}`)
                const res = await fetch("http://localhost:8080/api/users", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body: JSON.stringify({
                        password: input.password
                    })
                });
                const responseData = await res.json();
                if (res.status == 200) {
                    setMessageProps("Successfully changed password.", "success");
                    localStorage.setItem("user", JSON.stringify(responseData))
                } else if (res.status == 400) {
                    // TODO implement good failure handling
                    setMessageProps("Failure: 400", "error");
                } else if (res.status == 403) {
                    setMessageProps("Your token is invalid.", "error")
                }
            } catch (error) {
                alert(`An error has occurred: ${error}.`)
            }
        }
    };

    //const submitChanges = async () => {}

    const submitAccountDeletion = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/user/edit-user", {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                }
            )
            if (res.status == 200) {
                setMessageProps("Successfully deleted account.", "success");
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                window.location.href = "http://localhost:5173/login";
            }
        } catch (error) {
            alert(`An error has occurred. ${error}.`)
        }
    }

    return (
        <Box sx={{width: "800px", display: "flex", height: "flex", backgroundColor: "#777", marginTop: 10}}>
            {/* Content */}
            <Box sx={{flexGrow: 1, padding: 4}}>

                <Box sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2}}>

                    <Box>
                        {/* Header */}
                        <Typography variant="subtitle1" sx={{mb: 2}}>
                            {/*<Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}> */}
                            <Typography variant="h4">
                                Name Surname
                                {/* userName */}
                            </Typography>
                            {/*</Box> */}

                            <Typography variant="subtitle1" sx={{mb: 2}}>
                                {userEmail}
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
                                    submitAccountDeletion()
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
                {(isEditProfile || isChangePassword) && (
                    <Box sx={{
                        display: "grid",
                        justifyContent: "center",

                        /* display: "flex", justifyContent: "space-between", */
                        /* mb: 4 */
                    }}>
                        <Typography variant="h6" sx={{mb: 2}}>
                            {isEditProfile ? "Edit Profile" : "Change Password"}
                        </Typography>
                        {showMessage && (
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
                        <Box sx={{display: "center", paddingX: 1, gap: 2,}}>
                            <Button
                                variant="contained"
                                sx={{mt: 2}}
                                onClick={isEditProfile ? submitEditProfile : submitChangePassword}
                            >
                                Confirm
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{mt: 2}}
                                onClick={() => {
                                    isEditProfile ? setIsEditProfile(false) : setIsChangePassword(false);
                                    setInputToDefault();
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
                {(isEditProfile || isChangePassword) && (
                    <Divider sx={{my: 2}}/>
                )}

                {/* Papers and Reviews */}
                {/*}
                <Box sx={{display: "flex", gap: 4}}>

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
                    */}
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <PaperList
                            endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                            title="My Papers"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <PaperList
                            endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`}
                            title="My Reviews"
                        >
                        </PaperList>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ProfilePage;
