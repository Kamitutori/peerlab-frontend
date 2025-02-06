// src/utils/alertDialogUtils.ts
import { createContext, useContext } from 'react';

export interface AlertDialogContextType {
    showAlert: (title: string, message: string, okText: string, cancelText: string) => Promise<boolean>;
}

export const AlertDialogContext = createContext<AlertDialogContextType | null>(null);

export function useAlertDialog() {
    const context = useContext(AlertDialogContext);
    if (!context) throw new Error("useAlertDialog must be used within an AlertDialogProvider.");
    return context;
}