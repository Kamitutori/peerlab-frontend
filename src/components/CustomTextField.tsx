import { TextField, TextFieldProps } from '@mui/material';

const CustomTextField = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            fullWidth
            margin="normal"
            slotProps={{
                inputLabel: {
                    style: {
                        color: 'primary.main'
                    }
                },
                input: {
                    style: {
                        color: 'primary.main'
                    }
                }
            }}
        />
    );
};

export default CustomTextField;