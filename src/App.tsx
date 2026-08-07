import { BrowserRouter } from "react-router";
import { RootRoute } from "./routes"

export default function App() {
    return (
        <BrowserRouter>
            <RootRoute />
        </BrowserRouter>
    );
}
