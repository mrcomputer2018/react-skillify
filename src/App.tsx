import { BrowserRouter } from "react-router";
import { AuthProvider } from "@/contexts/authContext";
import { ToastProvider } from "@/contexts/toastContext";
import { Toast } from "@/components/ui/toast";
import { RootRoute } from "./routes";
import { ThemeProvider } from "./contexts/theme-provider";

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <AuthProvider>
                    <ToastProvider>
                        <RootRoute />
                        <Toast />
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
