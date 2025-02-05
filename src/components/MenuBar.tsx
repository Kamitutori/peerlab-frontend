import * as React from 'react';
import { styled, Theme, CSSObject, useTheme } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeerLabIcon from '../assets/peerlab_logo_minimal_transparent_white.svg';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUpdateAuth } from "./auth/AuthenticationContext.tsx";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {useAlertDialog} from "../utils/alertDialogUtils.ts";


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#1976d2',
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

/** This drawer serves as the nav bar. */
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface TopMenuBarProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
}

export default function MenuAppBar({ toggleTheme, isDarkMode }: TopMenuBarProps) {
    const { logout } = useUpdateAuth();
    const { showAlert } = useAlertDialog();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState<string | null>("");
    const LOCAL_STORAGE_UPDATE_EVENT = "localStorageUpdate";


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const redirect = () => {
        navigate('/profile');
    }

    React.useEffect(() => {
        const updateUsername = () => {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                try {
                    setUsername(JSON.parse(userJson).name);
                } catch {
                    showAlert("User Object Error", "Unexpected behavior: User object in local storage is not a valid JSON object. You will be logged out as a result.", "", "OK")
                        .then(() => { logout(); });
                }
            } else {
                showAlert("Invalid Storage State", "There is no user object in your local storage. You will be logged out.", "", "OK")
                    .then(() => {logout();});
            }
        };
        // Set username on component mount
        updateUsername();

        const handleStorageChange = () => {
            updateUsername();
        };
        window.addEventListener(LOCAL_STORAGE_UPDATE_EVENT, handleStorageChange);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener(LOCAL_STORAGE_UPDATE_EVENT, handleStorageChange);
        };
    });

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src={PeerLabIcon} width="50" height="50" alt="logo" />
                    <Typography variant="h6" component="div" align={"left"} sx={{ flexGrow: 1, marginLeft: 2 }}>
                        {username}
                    </Typography>
                    <Button color="inherit" onClick={toggleTheme}>
                        {isDarkMode ? <LightModeIcon/> : <DarkModeIcon/>}
                    </Button>
                    <div>
                        <Button variant="outlined" sx={{ color: 'white', size: 'small' }} onClick={logout}>
                            Log out
                        </Button>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            onClick={redirect}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <Link to="/" className="site-title"></Link>
                <List>
                    {['Dashboard'].map((text) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <Link to="/dashboard">
                                <ListItemButton
                                    onClick={handleDrawerClose}
                                    sx={[
                                        {
                                            minHeight: 48,
                                            px: 2.5,
                                            color: 'text.primary',
                                        },
                                        open ? {justifyContent: 'initial',} : {justifyContent: 'center',},
                                    ]}
                                >
                                    <ListItemIcon
                                        sx={[
                                            {
                                                minWidth: 0,
                                                justifyContent: 'center',
                                            },
                                            open ? {mr: 3,} : {mr: 'auto',},
                                        ]}
                                    >
                                        {<HomeIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text}
                                        sx={[
                                            open ? {opacity: 1,} : {opacity: 0,},
                                        ]}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Papers', 'Reviews'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <Link to={text === 'Papers' ? "/papers" : "/reviews"}>
                                <ListItemButton
                                    onClick={handleDrawerClose}
                                    sx={[
                                        {
                                            minHeight: 48,
                                            px: 2.5,
                                            color: 'text.primary',
                                        },
                                        open ? {justifyContent: 'initial',} : {justifyContent: 'center',},
                                    ]}
                                >
                                    <ListItemIcon
                                        sx={[{
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                            open ? {mr: 3,} : {mr: 'auto',},
                                        ]}
                                    >
                                        {index === 0 ? <MenuBookIcon /> : <LibraryBooksIcon />}

                                    </ListItemIcon>
                                    <ListItemText

                                        primary={text}
                                        sx={[
                                            open ? {opacity: 1,} : {opacity: 0,},
                                        ]}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}