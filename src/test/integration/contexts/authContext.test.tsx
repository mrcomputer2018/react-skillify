import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
    AUTH_STORAGE_KEY,
    AuthProvider,
    type AuthUser,
    useAuth,
} from "@/contexts/authContext";

const USER: AuthUser = {
    usuarioId: 1,
    usuario: "joao",
    token: "tok-1",
    role: "USER",
};

function Harness() {
    const { user, isAuthenticated, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="status">
                {isAuthenticated ? "authenticated" : "anonymous"}
            </span>
            <span data-testid="user">{user?.usuario ?? "none"}</span>
            <button onClick={() => login(USER)}>login</button>
            <button onClick={() => logout()}>logout</button>
        </div>
    );
}

function ThrowingComponent() {
    useAuth();
    return null;
}

describe("AuthProvider / useAuth", () => {
    it("starts unauthenticated with no stored user", async () => {
        render(
            <AuthProvider>
                <Harness />
            </AuthProvider>,
        );

        await waitFor(() =>
            expect(screen.getByTestId("status")).toHaveTextContent(
                "anonymous",
            ),
        );
    });

    it("restores a previously stored user on mount", async () => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(USER));

        render(
            <AuthProvider>
                <Harness />
            </AuthProvider>,
        );

        await waitFor(() =>
            expect(screen.getByTestId("status")).toHaveTextContent(
                "authenticated",
            ),
        );
        expect(screen.getByTestId("user")).toHaveTextContent("joao");
    });

    it("login() sets the user in state and persists it to storage", async () => {
        const user = userEvent.setup();
        render(
            <AuthProvider>
                <Harness />
            </AuthProvider>,
        );

        await user.click(screen.getByText("login"));

        expect(screen.getByTestId("status")).toHaveTextContent(
            "authenticated",
        );
        await waitFor(() =>
            expect(
                JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "null"),
            ).toEqual(USER),
        );
    });

    it("logout() clears the user from state and storage", async () => {
        const user = userEvent.setup();
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(USER));

        render(
            <AuthProvider>
                <Harness />
            </AuthProvider>,
        );

        await waitFor(() =>
            expect(screen.getByTestId("status")).toHaveTextContent(
                "authenticated",
            ),
        );

        await user.click(screen.getByText("logout"));

        expect(screen.getByTestId("status")).toHaveTextContent("anonymous");
        await waitFor(() =>
            expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull(),
        );
    });

    it("throws when useAuth is used outside of an AuthProvider", () => {
        expect(() => render(<ThrowingComponent />)).toThrow(
            "useAuth deve ser usado dentro de um AuthProvider.",
        );
    });
});
