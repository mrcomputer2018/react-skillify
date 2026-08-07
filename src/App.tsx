import { BrowserRouter } from "react-router";
import { AuthProvider } from "@/contexts/authContext";
import { RootRoute } from "./routes";
import { ThemeProvider } from "./contexts/theme-provider";

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <AuthProvider>
                    <RootRoute />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
