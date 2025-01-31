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
    components: {
        MuiTextField: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "2px",
                        },
                        "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderWidth: "2px",
                            },
                        },
                        "&.Mui-disabled": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#e8e8e8",
                            },
                            "& .MuiOutlinedInput-input": {
                                color: "#e8e8e8",
                            },
                        },
                    },
                    "& .MuiInputLabel-outlined": {
                        "&.Mui-focused": {
                            color: "primary",
                            fontWeight: "bold",
                        },
                    }
                }
            }
        }
    }
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
    components: {
        MuiTextField: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "2px",
                        },
                        "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderWidth: "2px",
                            },
                        },
                        "&.Mui-disabled": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#353535",
                            },
                            "& .MuiOutlinedInput-input": {
                                color: "#353535",
                            },
                        },
                    },
                    "& .MuiInputLabel-outlined": {
                        "&.Mui-focused": {
                            color: "primary",
                            fontWeight: "bold",
                        },
                    }
                }
            }
        }
    }
});