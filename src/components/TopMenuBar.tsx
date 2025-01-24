//import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PeerLabIcon from '../assets/peerlabLogo_squared.svg';
//import PeerLabIcon from '../assets/PearLab.svg';
import {useNavigate} from "react-router-dom";

/**
 * Notice TODO: Look up MUI AppBar to see an implementation of handling authorization and submenus.
 */

export default function MenuAppBar() {
    /*
    const [auth, setAuth] = React.useState(true);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };
    */

    let navigate = useNavigate();
    const redirect = () => {
        navigate('/profile');
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <img src={PeerLabIcon} width="50" height="50" alt="logo"/>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}} >
                        *Username*
                    </Typography>
                    {/* {auth && (*/}
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                onClick={redirect}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                        </div>
                    {/* )} */}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
