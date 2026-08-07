import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from "react";

export type ToastType = "success" | "error";

type ToastState = {
    type: ToastType;
    message: string;
} | null;

type ToastContextValue = {
    toast: ToastState;
    showToast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastState>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

    const showToast = useCallback((type: ToastType, message: string) => {
        clearTimeout(timerRef.current);
        setToast({ type, message });
        timerRef.current = setTimeout(() => setToast(null), 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider.");
    }

    return context;
}
