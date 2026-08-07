import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { Navigate, Route, Routes } from "react-router";

export function PublicRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
