import { HomePage } from "@/pages/Home";
import { Navigate, Route, Routes } from "react-router";

export function PrivateRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}
