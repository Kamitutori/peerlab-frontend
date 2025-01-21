import * as React from 'react';
import {
    Button,
    FormControl,
    //FormControlLabel,
    //Checkbox,
    InputLabel,
    OutlinedInput,
    TextField,
    InputAdornment,
    Link,
    Alert,
    IconButton, createTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
    return (
        <TextField
            id="input-with-icon-textfield"
            label="Email"
            name="email"
            type="email"
            size="small"
            fullWidth
            variant="outlined"
        />
    );
}

function CustomPasswordField() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    return (
        <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
            <InputLabel size="small" htmlFor="outlined-adornment-password">
                Password
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                size="small"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                        >
                            {showPassword ? (
                                <VisibilityOff fontSize="inherit" />
                            ) : (
                                <Visibility fontSize="inherit" />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
}

function CustomButton() {
    return (
        <Button
            type="submit"
            variant="outlined"
            color="info"
            size="small"
            disableElevation
            fullWidth
            sx={{ my: 2 }}
        >
            Sign Up
        </Button>
    );
}

function ReturnToLogin() {
    return (
        <Link href="/login" variant="body2">
            Return to Login
        </Link>
    );
}

function ForgotPasswordLink() {
    return (
        <Link href="/forgot-password" variant="body2">
            Forgot password?
        </Link>
    );
}

function Title() {
    return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

function Subtitle() {
    return (
        <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="error">
            No functionality yet...
        </Alert>
    );
}

/*
function AgreeWithTerms() {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    name="tandc"
                    value="true"
                    color="primary"
                    sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                />
            }
            slotProps={{
                typography: {
                    fontSize: 14,
                },
            }}
            color="textSecondary"
            label="I agree with the T&C"
        />
    );
}
*/

export default function SlotsSignUp() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: { default: '#333' },
            primary: { main: '#5567d6' },
        },
    });
    return (
        <AppProvider theme={darkTheme}>
            <SignInPage>
                signIn={(provider: any, formData: any) =>
                alert(
                    `Signing up with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}, and checkbox value: ${formData.get('tandc')}.`,
                )
            }
                slots={{
                title: Title,
                subtitle: Subtitle,
                nameField: CustomEmailField,
                emailField: CustomEmailField,
                passwordField: CustomPasswordField,
                submitButton: CustomButton,
                signUpLink: ReturnToLogin,
                //rememberMe: AgreeWithTerms,
                forgotPasswordLink: ForgotPasswordLink,


            }}
                providers={providers}

            </SignInPage>
        </AppProvider>
    );
}
