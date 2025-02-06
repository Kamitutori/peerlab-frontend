import { ReactNode, useState, useRef } from 'react';
import AlertDialog from './AlertDialog';
import { AlertDialogContext } from '../utils/alertDialogUtils';

export default function AlertDialogProvider({ children }: { children: ReactNode }) {
    const resolveRef = useRef<(value: boolean) => void>(() => {});

    const [dialogState, setDialogState] = useState({
        open: false,
        title: '',
        message: '',
        okText: '',
        cancelText: ''
    });

    const showAlert = (title: string, message: string, okText: string, cancelText: string) => {
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve; // Store resolve in a ref
            setDialogState({ open: true, title, message, okText, cancelText });
        });
    };

    const handleClose = (result: boolean) => {
        resolveRef.current(result); // Call resolve from ref
        setDialogState((prevState) => ({ ...prevState, open: false }));
    };

    return (
        <AlertDialogContext.Provider value={{ showAlert }}>
            {children}
            <AlertDialog
                open={dialogState.open}
                title={dialogState.title}
                message={dialogState.message}
                okText={dialogState.okText}
                cancelText={dialogState.cancelText}
                onClose={handleClose}
            />
        </AlertDialogContext.Provider>
    );
}
