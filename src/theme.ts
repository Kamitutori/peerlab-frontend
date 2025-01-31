import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5',
        },
    },
    typography: {
        h4: {
            color: '#000000',
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#252525',
            paper: '#272626',
        },
    },
    typography: {
        h4: {
            color: '#ffffff',
        },
    },
});