import { createContext, useContext, useState, ReactNode } from 'react';
import AlertDialog from './AlertDialog';

interface AlertDialogContextType {
    showAlert: (title: string, message: string, okText: string, cancelText: string) => Promise<boolean>;
}

const AlertDialogContext = createContext<AlertDialogContextType | null>(null);

export function useAlertDialog() {
    const context = useContext(AlertDialogContext);
    if (!context) throw new Error("useAlertDialog must be used within an AlertDialogProvider.");
    return context;
}

export default function AlertDialogProvider({children}: { children: ReactNode })  {
    const [dialogState, setDialogState] = useState({
        open: false,
        title: '',
        message: '',
        okText: '',
        cancelText: '',
        resolve: (value: boolean) => {}
    });

    const showAlert = (title: string, message: string, okText: string, cancelText: string) => {
        return new Promise<boolean>((resolve) => {
            setDialogState({ open: true, title, message, okText, cancelText, resolve });
        });
    };

    const handleClose = (result: boolean) => {
        setDialogState((prevState) => ({ ...prevState, open: false }));
        dialogState.resolve(result);
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
};