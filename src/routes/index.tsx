import { useAuth } from "@/contexts/authContext";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export function RootRoute() {
    const { isAuthenticated } = useAuth();
    return <>{isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}</>;
}
