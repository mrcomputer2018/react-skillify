import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export function RootRoute() {
    const user = null; // Replace with your authentication logic
    return <>{user ? <PrivateRoutes /> : <PublicRoutes />}</>;
}
