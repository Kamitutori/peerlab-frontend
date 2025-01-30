import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
    title: string;
    message: string;
    open: boolean;
    okText: string;
    cancelText: string;
    onClose: (result: boolean) => void;
}

export default function AlertDialog({ title, message, open, okText, cancelText, onClose }: AlertDialogProps) {
    return (
        <Dialog
            open={open}
            keepMounted
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={() => onClose(true)}>{okText}</Button>
                <Button variant="outlined" onClick={() => onClose(false)}>{cancelText}</Button>
            </DialogActions>
        </Dialog>
    );
}